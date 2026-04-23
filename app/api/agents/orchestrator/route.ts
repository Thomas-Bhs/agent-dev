import { createGroq } from '@ai-sdk/groq';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { Client } from 'langsmith';
import { traceable } from 'langsmith/traceable';

const groq = createGroq();
const langsmithClient = new Client({
  apiKey: process.env.LANGSMITH_API_KEY,
});

export const maxDuration = 30;

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

      const result = streamText({
        model: groq('llama-3.3-70b-versatile'),
        system: `Tu es l'orchestrateur d'un système multi-agents de développement.

Tu coordonnes 3 agents spécialisés :
- Agent DEV (/api/agents/dev) : création de code, composants React/RN, hooks, architecture
- Agent DEBUG (/api/agents/debug) : analyse d'erreurs, correction de bugs, performance
- Agent QA (/api/agents/qa) : génération de tests, couverture, stratégie qualité

Ton rôle :
- Analyser la demande de l'utilisateur
- Décider quel(s) agent(s) sont les mieux placés
- Déléguer et orchestrer les réponses
- Pour les tâches complexes, utiliser plusieurs agents en séquence

Règles de délégation :
- Mots clés "erreur", "bug", "crash", "undefined", "TypeError" → Agent DEBUG
- Mots clés "test", "jest", "coverage", "spec" → Agent QA
- Mots clés "crée", "génère", "hook", "composant", "structure" → Agent DEV
- Tâches complexes → DEV puis DEBUG puis QA en séquence

IMPORTANT — Après avoir utilisé un tool :
- Affiche TOUJOURS le résultat complet de chaque agent
- Structure ta réponse avec des sections claires : "## Agent Dev", "## Agent Debug", "## Agent QA"
- Ne résume pas — montre le vrai code et les vraies réponses de chaque agent`,

        messages,
        maxSteps: 5,
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
