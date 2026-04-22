export const qaQuestions = [
  {
    id: 'QA-Q1',
    question:
      'Génère des tests unitaires pour ce hook : const useCounter = () => { const [count, setCount] = useState(0); return { count, increment: () => setCount(c => c + 1) } }',
    expectedTool: 'generateTests',
  },
  {
    id: 'QA-Q2',
    question:
      'Génère des tests pour ce composant React : function Button({ onClick, disabled, label }) { return <button onClick={onClick} disabled={disabled}>{label}</button> }',
    expectedTool: 'generateTests',
  },
  {
    id: 'QA-Q3',
    question:
      'Quelle stratégie de tests pour une app Next.js fullstack avec authentification et API routes ?',
    expectedTool: 'suggestTestStrategy',
  },
  {
    id: 'QA-Q4',
    question:
      'Analyse la couverture de ce code et dis moi ce qui manque : function divide(a, b) { return a / b }',
    expectedTool: 'analyzeTestCoverage',
  },
  {
    id: 'QA-Q5',
    question:
      "Génère des tests d'intégration pour une route API Next.js POST /api/users qui crée un utilisateur",
    expectedTool: 'generateTests',
  },
  {
    id: 'QA-Q6',
    question:
      'Génère des tests pour ce hook React Native : const useNetworkStatus = () => { const [isOnline, setIsOnline] = useState(true); return { isOnline } }',
    expectedTool: 'generateTests',
  },
  {
    id: 'QA-Q7',
    question: "Quels edge cases tester pour une fonction de validation d'email en TypeScript ?",
    expectedTool: 'analyzeTestCoverage',
  },
  {
    id: 'QA-Q8',
    question:
      "Génère des tests pour un composant React Native FlatList qui affiche une liste d'utilisateurs",
    expectedTool: 'generateTests',
  },
  {
    id: 'QA-Q9',
    question:
      'Quelle stratégie de tests pour une app React Native avec navigation et état global ?',
    expectedTool: 'suggestTestStrategy',
  },
  {
    id: 'QA-Q10',
    question:
      "Analyse ce code et dis moi quels cas ne sont pas testés : async function fetchUser(id) { const res = await fetch('/api/users/' + id); return res.json() }",
    expectedTool: 'analyzeTestCoverage',
  },
];
