import Groq from 'groq-sdk'
import * as fs from 'fs'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const BASE_URL = process.env.EVAL_URL || 'http://localhost:3000'

const questions = [
  {
    id: 'Q1',
    question: 'Crée un hook useLocalStorage en TypeScript',
    expectedTool: 'none',
  },
  {
    id: 'Q2',
    question: "Analyse ce code : const data = await fetch('/api').then(r => r.json())",
    expectedTool: 'analyzeCode',
  },
  {
    id: 'Q3',
    question: 'Quelle structure de fichiers pour une feature de panier e-commerce en Next.js ?',
    expectedTool: 'suggestFileStructure',
  },
  {
    id: 'Q4',
    question: 'Génère un composant React Native Card avec image, titre et description',
    expectedTool: 'generateComponent',
  },
  {
    id: 'Q5',
    question: 'Recherche dans la docs React Native comment gérer la navigation',
    expectedTool: 'searchDocs',
  },
  {
    id: 'Q6',
    question: 'Comment typer correctement un contexte React avec TypeScript ?',
    expectedTool: 'none',
  },
  {
    id: 'Q7',
    question: 'Comment optimiser les re-renders dans une liste React avec 1000 items ?',
    expectedTool: 'none',
  },
  {
    id: 'Q8',
    question: 'Comment structurer une app React Native avec authentification et navigation ?',
    expectedTool: 'suggestFileStructure',
  },
  {
    id: 'Q9',
    question:
      'Analyse ce code qui cause une boucle infinie : useEffect(() => { setCount(count + 1) }, [count])',
    expectedTool: 'analyzeCode',
  },
  {
    id: 'Q10',
    question:
      'Recherche dans la docs Next.js comment implémenter l authentification avec middleware',
    expectedTool: 'searchDocs',
  },
]

async function askAgent(question: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/agent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: question }],
    }),
  })

  const text = await res.text()
  const lines = text.split('\n').filter((l) => l.startsWith('0:'))
  const content = lines
    .map((l) => {
      try {
        return JSON.parse(l.slice(2))
      } catch {
        return ''
      }
    })
    .join('')

  return content
}

async function judgeResponse(question: string, response: string): Promise<{
  score: number
  reason: string
}> {
  const judgment = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      {
        role: 'system',
        content: `Tu es un évaluateur expert en développement React/Next.js/React Native.
Note la réponse de 0 à 3 :
- 0 = Incorrecte ou hallucination
- 1 = Partielle ou imprécise  
- 2 = Correcte mais incomplète
- 3 = Correcte et complète avec exemple de code

Réponds UNIQUEMENT en JSON : {"score": X, "reason": "explication courte"}`,
      },
      {
        role: 'user',
        content: `Question: ${question}\n\nRéponse à évaluer:\n${response}`,
      },
    ],
    temperature: 0,
  })

  try {
    const text = judgment.choices[0].message.content || '{}'
    return JSON.parse(text)
  } catch {
    return { score: 0, reason: 'Erreur de parsing' }
  }
}

async function runEval() {
  console.log('🚀 Démarrage de l\'évaluation...\n')
  const results = []
  let totalScore = 0

  for (const q of questions) {
    console.log(`📝 ${q.id}: ${q.question.slice(0, 50)}...`)

    const response = await askAgent(q.question)
    const judgment = await judgeResponse(q.question, response)

    const result = {
      id: q.id,
      question: q.question,
      expectedTool: q.expectedTool,
      response: response.slice(0, 500),
      score: judgment.score,
      reason: judgment.reason,
    }

    results.push(result)
    totalScore += judgment.score
    console.log(`  Score: ${judgment.score}/3 — ${judgment.reason}\n`)

    await new Promise((r) => setTimeout(r, 2000))
  }

  const avgScore = (totalScore / questions.length).toFixed(2)
  console.log(`\n✅ Évaluation terminée`)
  console.log(`📊 Score moyen: ${avgScore}/3`)

  const report = {
    model: 'llama-3.3-70b-versatile',
    date: new Date().toISOString(),
    avgScore,
    totalScore,
    results,
  }

  fs.writeFileSync('evaluation/results-llama.json', JSON.stringify(report, null, 2))
  console.log('📄 Résultats sauvegardés dans evaluation/results-llama.json')
}

runEval().catch(console.error)