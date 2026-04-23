import { createAnthropic } from '@ai-sdk/anthropic';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { Client } from 'langsmith';
import { traceable } from 'langsmith/traceable';

const anthropic = createAnthropic();
const langsmithClient = new Client({
  apiKey: process.env.LANGSMITH_API_KEY,
});

export const maxDuration = 60;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function callAgent(route: string, message: string): Promise<string> {
  const res = await fetch(`${BASE_URL}${route}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: message }],
    }),
  });

  const text = await res.text();
  const lines = text.split('\n').filter((l) => l.startsWith('0:'));
  return lines
    .map((l) => {
      try {
        return JSON.parse(l.slice(2));
      } catch {
        return '';
      }
    })
    .join('');
}

export const POST = traceable(
  async (req: Request) => {
    try {
      const { messages } = await req.json();

      const trimmedMessages = messages.slice(-6);

      const result = streamText({
        model: anthropic('claude-sonnet-4-5'),
        system:  `Tu es l'orchestrateur de 3 agents spécialisés :
        - Agent DEV (/api/agents/dev) : code, composants, hooks, architecture
        - Agent DEBUG (/api/agents/debug) : erreurs, bugs, performance
        - Agent QA (/api/agents/qa) : tests, couverture, qualité

        Délégation :
        - "erreur/bug/crash/undefined/TypeError" → DEBUG
        - "test/jest/coverage/spec" → QA
        - "crée/génère/hook/composant/structure" → DEV
        - Tâches complexes → DEV puis DEBUG puis QA

        Après chaque tool : afficher le résultat complet avec sections ## Agent Dev / ## Agent Debug / ## Agent QA`,

        messages: trimmedMessages,
        maxSteps: 5,
        maxTokens: 2000,
        onError: (error) => console.error('Orchestrator error:', JSON.stringify(error)),
        tools: {
          delegateToAgent: tool({
            description: 'Délègue une tâche à un agent spécialisé et retourne sa réponse',
            parameters: z.object({
              agent: z.enum(['dev', 'debug', 'qa']).describe("L'agent à appeler"),
              task: z.string().describe("La tâche à confier à l'agent"),
              reason: z.string().describe('Pourquoi cet agent est le mieux placé'),
            }),
            execute: async ({ agent, task, reason }) => {
              const routes: Record<string, string> = {
                dev: '/api/agents/dev',
                debug: '/api/agents/debug',
                qa: '/api/agents/qa',
              };
              console.log(`Orchestrateur → Agent ${agent}: ${reason}`);
              const response = await callAgent(routes[agent], task);
              return { agent, task, reason, response: response.slice(0, 1000) }; //limit response size at 1000 chars
            },
          }),

          planTask: tool({
            description: 'Planifie une tâche complexe nécessitant plusieurs agents en séquence',
            parameters: z.object({
              task: z.string().describe('La tâche complexe à décomposer'),
              steps: z
                .array(
                  z.object({
                    agent: z.enum(['dev', 'debug', 'qa']),
                    instruction: z.string().describe("L'instruction pour cet agent"),
                  })
                )
                .describe('Les étapes du pipeline'),
            }),
            execute: async ({ task, steps }) => {
              console.log(`Pipeline: ${steps.map((s) => s.agent).join(' → ')}`);
              const results = [];
              let previousOutput = ''; //each agent can see the previous output to have more context

              for (const step of steps) {
                const routes: Record<string, string> = {
                  dev: '/api/agents/dev',
                  debug: '/api/agents/debug',
                  qa: '/api/agents/qa',
                };
                const instruction = previousOutput
                  ? `${step.instruction}\n\nContexte de l'étape précédente:\n${previousOutput.slice(
                      0,
                      500
                    )}`
                  : step.instruction;

                const response = await callAgent(routes[step.agent], instruction);
                previousOutput = response;
                results.push({ agent: step.agent, response: response.slice(0, 500) });

                await new Promise((r) => setTimeout(r, 1000));
              }

              return { task, pipeline: steps.map((s) => s.agent).join(' → '), results };
            },
          }),
        },
      });

      return result.toDataStreamResponse();
    } catch (error) {
      console.error('Orchestrator error:', error);
      return new Response(JSON.stringify({ error: String(error) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
  { name: 'agent-orchestrator-post', client: langsmithClient }
);
