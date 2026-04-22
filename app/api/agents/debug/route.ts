import { createGroq } from '@ai-sdk/groq'
import { streamText, tool } from 'ai'
import { z } from 'zod'
import { Client } from 'langsmith'
import { traceable } from 'langsmith/traceable'

const groq = createGroq()
const langsmithClient = new Client({
  apiKey: process.env.LANGSMITH_API_KEY,
})

export const maxDuration = 30

export const POST = traceable(
  async (req: Request) => {
    try {
      const { messages, fileContent } = await req.json()

      const baseSystem = `Tu es un agent expert en debugging et résolution de bugs pour les applications web et mobile (React, Next.js, React Native, Node.js, TypeScript).

      Ton rôle :
      - Identifier la cause racine des erreurs et bugs
      - Proposer des solutions précises et testées
      - Expliquer pourquoi le bug se produit
      - Prévenir les bugs similaires à l'avenir

      Règles IMPORTANTES :
      - Toujours identifier la cause racine avant de proposer une solution
      - Donner du code corrigé et fonctionnel
      - Expliquer la différence entre le code bugué et le code corrigé
      - Mentionner les edge cases potentiels
      - Utiliser des blocs de code markdown avec le langage spécifié ex: \`\`\`typescript`

      const system = fileContent
        ? `${baseSystem}\n\nFichier attaché (${fileContent.name}):\n\`\`\`\n${fileContent.content}\n\`\`\``
        : baseSystem

      const result = streamText({
        model: groq('llama-3.3-70b-versatile'),
        system,
        messages,
        maxSteps: 3,
        onError: (error) => console.error('Debug agent error:', JSON.stringify(error)),
        tools: {
          analyzeError: tool({
            description: 'Analyse une erreur ou un bug et identifie la cause racine',
            parameters: z.object({
              error: z.string().describe('Le message d\'erreur ou la description du bug'),
              code: z.string().optional().describe('Le code qui cause l\'erreur'),
              context: z.string().optional().describe('Le contexte de l\'erreur (stack trace, environnement...)'),
            }),
            execute: async ({ error, code, context }) => {
              return { error, code, context, timestamp: new Date().toISOString() }
            },
          }),
          suggestFix: tool({
            description: 'Propose une correction pour un bug identifié',
            parameters: z.object({
              bugDescription: z.string().describe('Description du bug à corriger'),
              currentCode: z.string().describe('Le code actuel avec le bug'),
              language: z.string().describe('Le langage : typescript, javascript, tsx...'),
            }),
            execute: async ({ bugDescription, currentCode, language }) => {
              return { bugDescription, currentCode, language, timestamp: new Date().toISOString() }
            },
          }),
          checkPerformance: tool({
            description: 'Analyse les problèmes de performance dans un code',
            parameters: z.object({
              code: z.string().describe('Le code à analyser'),
              context: z.string().optional().describe('Contexte : composant React, API route, hook...'),
            }),
            execute: async ({ code, context }) => {
              return { code, context, timestamp: new Date().toISOString() }
            },
          }),
        },
      })

      return result.toDataStreamResponse()

    } catch (error) {
      console.error('Debug agent error:', error)
      return new Response(JSON.stringify({ error: String(error) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  },
  { name: 'agent-debug-post', client: langsmithClient }
)