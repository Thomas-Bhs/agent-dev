import { createAnthropic } from '@ai-sdk/anthropic';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { Client } from 'langsmith';
import { traceable } from 'langsmith/traceable';

const anthropic = createAnthropic();
const langsmithClient = new Client({
  apiKey: process.env.LANGSMITH_API_KEY,
});

export const maxDuration = 30;

export const POST = traceable(
  async (req: Request) => {
    try {
      const { messages, fileContent } = await req.json();

      const baseSystem = `Tu es un agent expert en qualité logicielle et tests pour les applications web et mobile (React, Next.js, React Native, Node.js, TypeScript).

      Ton rôle :
      - Générer des tests unitaires et d'intégration complets
      - Analyser la couverture de tests existante
      - Identifier les cas limites (edge cases) non testés
      - Proposer une stratégie de tests adaptée au projet

      Règles IMPORTANTES :
      - Utiliser Jest et React Testing Library pour les tests React/Next.js
      - Utiliser Jest et React Native Testing Library pour React Native
      - Toujours tester les cas nominaux ET les cas d'erreur
      - Nommer les tests de manière descriptive (describe/it)
      - Utiliser des blocs de code markdown avec le langage spécifié ex: \`\`\`typescript`;

      const system = fileContent
        ? `${baseSystem}\n\nFichier attaché (${fileContent.name}):\n\`\`\`\n${fileContent.content}\n\`\`\``
        : baseSystem;

      const result = streamText({
        model: anthropic('claude-sonnet-4-5'),
        system,
        messages,
        maxSteps: 3,
        onError: (error) => console.error('QA agent error:', JSON.stringify(error)),
        tools: {
          generateTests: tool({
            description:
              "Génère des tests unitaires ou d'intégration pour un composant ou une fonction",
            parameters: z.object({
              code: z.string().describe('Le code à tester'),
              language: z.string().describe('Le langage : typescript, javascript, tsx...'),
              testType: z.enum(['unit', 'integration', 'e2e']).describe('Type de test'),
              platform: z
                .enum(['web', 'mobile'])
                .describe('web pour React/Next.js, mobile pour React Native'),
            }),
            execute: async ({ code, language, testType, platform }) => {
              return { code, language, testType, platform, timestamp: new Date().toISOString() };
            },
          }),
          analyzeTestCoverage: tool({
            description:
              "Analyse la couverture de tests d'un fichier et identifie les cas non testés",
            parameters: z.object({
              code: z.string().describe('Le code source'),
              existingTests: z.string().optional().describe('Les tests existants si disponibles'),
            }),
            execute: async ({ code, existingTests }) => {
              return { code, existingTests, timestamp: new Date().toISOString() };
            },
          }),
          suggestTestStrategy: tool({
            description: 'Propose une stratégie de tests adaptée au type de projet',
            parameters: z.object({
              projectType: z.enum(['web', 'mobile', 'api', 'fullstack']).describe('Type de projet'),
              features: z.array(z.string()).describe('Liste des features à tester'),
            }),
            execute: async ({ projectType, features }) => {
              return { projectType, features, timestamp: new Date().toISOString() };
            },
          }),
        },
      });

      return result.toDataStreamResponse();
    } catch (error) {
      console.error('QA agent error:', error);
      return new Response(JSON.stringify({ error: String(error) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
  { name: 'agent-qa-post', client: langsmithClient }
);
