import { createGroq } from '@ai-sdk/groq';
import { streamText, tool } from 'ai';
import { z } from 'zod';

const groq = createGroq();

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: groq('llama-3.1-8b-instant'),
      system: `Tu es un agent expert en développement web et mobile (React, Next.js, React Native, Node.js, TypeScript).`,
      messages,
      maxSteps: 3,
      onError: (error) => console.error('streamText error:', JSON.stringify(error)),
      tools: {
        analyzeCode: tool({
          description:
            'Analyse un bloc de code et identifie les problèmes ou améliorations possibles',
          parameters: z.object({
            code: z.string().describe('Le code à analyser'),
            language: z.string().describe('Le langage : typescript, javascript, tsx...'),
          }),
          execute: async ({ code, language }) => {
            return {
              code,
              language,
              timestamp: new Date().toISOString(),
            };
          },
        }),
        suggestFileStructure: tool({
          description: 'Suggère une structure de fichiers pour un type de feature donné',
          parameters: z.object({
            featureType: z
              .string()
              .describe('Type de feature : auth, dashboard, api-route, component...'),
            platform: z.enum(['web', 'mobile', 'both']).describe('Plateforme cible'),
          }),
          execute: async ({ featureType, platform }) => {
            return { featureType, platform };
          },
        }),
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Agent error:', error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
