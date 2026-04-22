export const devQuestions = [
  {
    id: 'DEV-Q1',
    question: 'Crée un hook useLocalStorage en TypeScript',
    expectedTool: 'none',
  },
  {
    id: 'DEV-Q2',
    question: "Analyse ce code : const data = await fetch('/api').then(r => r.json())",
    expectedTool: 'analyzeCode',
  },
  {
    id: 'DEV-Q3',
    question: 'Quelle structure de fichiers pour une feature de panier e-commerce en Next.js ?',
    expectedTool: 'suggestFileStructure',
  },
  {
    id: 'DEV-Q4',
    question: 'Génère un composant React Native Card avec image, titre et description',
    expectedTool: 'generateComponent',
  },
  {
    id: 'DEV-Q5',
    question: 'Recherche dans la docs React Native comment gérer la navigation',
    expectedTool: 'searchDocs',
  },
  {
    id: 'DEV-Q6',
    question: 'Comment typer correctement un contexte React avec TypeScript ?',
    expectedTool: 'none',
  },
  {
    id: 'DEV-Q7',
    question: 'Comment optimiser les re-renders dans une liste React avec 1000 items ?',
    expectedTool: 'none',
  },
  {
    id: 'DEV-Q8',
    question: 'Comment structurer une app React Native avec authentification et navigation ?',
    expectedTool: 'suggestFileStructure',
  },
  {
    id: 'DEV-Q9',
    question:
      'Analyse ce code qui cause une boucle infinie : useEffect(() => { setCount(count + 1) }, [count])',
    expectedTool: 'analyzeCode',
  },
  {
    id: 'DEV-Q10',
    question:
      'Recherche dans la docs Next.js comment implémenter l authentification avec middleware',
    expectedTool: 'searchDocs',
  },
];
