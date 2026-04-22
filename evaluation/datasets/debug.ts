export const debugQuestions = [
  {
    id: 'DEBUG-Q1',
    question:
      "J'ai cette erreur : Cannot read properties of undefined (reading 'map'). Mon code : const items = data.items.map(item => item.name)",
    expectedTool: 'analyzeError',
  },
  {
    id: 'DEBUG-Q2',
    question:
      'Pourquoi ce code cause une fuite mémoire ? useEffect(() => { const interval = setInterval(() => setCount(c => c + 1), 1000) }, [])',
    expectedTool: 'analyzeError',
  },
  {
    id: 'DEBUG-Q3',
    question:
      "Mon composant React re-render à l'infini, voici le code : const [user, setUser] = useState({}); useEffect(() => { setUser({ name: 'John' }) }, [user])",
    expectedTool: 'analyzeError',
  },
  {
    id: 'DEBUG-Q4',
    question: "J'ai une erreur 'Maximum update depth exceeded' dans React, comment la corriger ?",
    expectedTool: 'suggestFix',
  },
  {
    id: 'DEBUG-Q5',
    question:
      'Mon appel API retourne 401 Unauthorized alors que mon token est correct, que vérifier ?',
    expectedTool: 'analyzeError',
  },
  {
    id: 'DEBUG-Q6',
    question:
      'Comment déboguer un problème de performance dans un composant React qui re-render trop souvent ?',
    expectedTool: 'checkPerformance',
  },
  {
    id: 'DEBUG-Q7',
    question:
      "J'ai cette erreur TypeScript : Type 'string | undefined' is not assignable to type 'string'. Comment corriger ?",
    expectedTool: 'suggestFix',
  },
  {
    id: 'DEBUG-Q8',
    question:
      'Mon useEffect se déclenche en boucle infinie avec un objet en dépendance, comment corriger ?',
    expectedTool: 'analyzeError',
  },
  {
    id: 'DEBUG-Q9',
    question:
      "Analyse ce code qui cause des re-renders inutiles : const config = { timeout: 3000 }; useEffect(() => { fetch('/api', config) }, [config])",
    expectedTool: 'checkPerformance',
  },
  {
    id: 'DEBUG-Q10',
    question: "J'ai une erreur CORS sur mon API Next.js, comment la résoudre ?",
    expectedTool: 'suggestFix',
  },
];
