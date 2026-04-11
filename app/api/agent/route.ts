import { createGroq } from '@ai-sdk/groq';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { tavily } from '@tavily/core';

const groq = createGroq();

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, fileContent } = await req.json();

    const baseSystem = `Tu es un agent expert en développement web et mobile (React, Next.js, React Native, Node.js, TypeScript).

      Ton rôle :
      - Analyser du code et identifier les problèmes
      - Proposer des solutions avec des exemples concrets
      - Expliquer les concepts avec le contexte du projet
      - Suggérer les meilleures pratiques et patterns

      Règles IMPORTANTES :
      - Toujours inclure un exemple de code complet et fonctionnel dans ta réponse
      - Le code doit être en TypeScript, typé correctement
      - Utiliser des blocs de code markdown avec le langage spécifié ex: \`\`\`typescript
      - Préciser si une solution est pour Web ou Mobile
      - Signaler les breaking changes ou dépendances importantes
      - Ne jamais répondre sans exemple de code sauf si la question est purement conceptuelle
      - Pour toute question sur Next.js, React, React Native ou CSS, utiliser TOUJOURS le tool searchDocs avant de répondre
      - Quand tu utilises searchDocs, base ta réponse UNIQUEMENT sur les résultats retournés par le tool. Cite toujours l'URL source à la fin de ta réponse.`;

    const system = fileContent
      ? `${baseSystem}\n\nFichier attaché par l'utilisateur (${fileContent.name}):\n\`\`\`\n${fileContent.content}\n\`\`\``
      : baseSystem;

    const result = streamText({
      model: groq('llama-3.3-70b-versatile'),
      system,
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
        searchDocs: tool({
          description:
            'Recherche dans la documentation officielle de Next.js, React, React Native ou MDN',
          parameters: z.object({
            query: z.string().describe('La recherche à effectuer'),
            topic: z
              .enum(['nextjs', 'react', 'react-native', 'mdn', 'general'])
              .describe('La documentation à cibler'),
          }),
          execute: async ({ query, topic }) => {
            const client = tavily({ apiKey: process.env.TAVILY_API_KEY! });

            const domains: Record<string, string[]> = {
              nextjs: ['nextjs.org'],
              react: ['react.dev'],
              'react-native': ['reactnative.dev'],
              mdn: ['developer.mozilla.org'],
              general: ['nextjs.org', 'react.dev', 'reactnative.dev', 'developer.mozilla.org'],
            };

            const response = await client.search(query, {
              includeDomains: domains[topic],
              maxResults: 3,
            });

            return {
              results: response.results.map((r) => ({
                title: r.title,
                url: r.url,
                content: r.content.slice(0, 500),
              })),
            };
          },
        }),
        generateComponent: tool({
          description:
            "Génère un composant React ou React Native complet à partir d'une description",
          parameters: z.object({
            name: z.string().describe('Le nom du composant en PascalCase, ex: UserCard'),
            description: z.string().describe('Ce que le composant doit faire'),
            platform: z
              .enum(['web', 'mobile'])
              .describe('web pour React, mobile pour React Native'),
            props: z
              .array(z.string())
              .describe('Liste des props attendues, ex: ["userId", "userName"]'),
          }),
          execute: async ({ name, platform, description, props }) => {
            return {
              name,
              platform,
              description,
              props,
              instruction: `Génère un composant ${
                platform === 'web' ? 'React' : 'React Native'
              } TypeScript nommé ${name} avec les props suivantes : ${props.join(
                ', '
              )}. Description : ${description}`,
            };
          },
        }),
        readFile: tool({
          description: "Lit et analyse le contenu d'un fichier de code fourni par l'utilisateur",
          parameters: z.object({
            filename: z.string().describe('Le nom du fichier'),
            content: z.string().describe('Le contenu du fichier'),
            analysisType: z
              .enum(['bugs', 'improvements', 'explain', 'full'])
              .describe("Type d'analyse : bugs, improvements, explain ou full"),
          }),
          execute: async ({ filename, content, analysisType }) => {
            return { filename, content, analysisType };
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
