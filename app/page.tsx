'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useState } from 'react';
import Topbar from './components/layout/Topbar';
import Sidebar from './components/layout/Sidebar';
import ChatMessages from './components/chat/ChatMessages';
import ChatInput from './components/chat/ChatInput';

interface FileContent {
  name: string;
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  agentName: string;
  agentColor: string;
  date: string;
}

const AGENTS = [
  {
    id: 'dev',
    name: 'Dev',
    description: 'Code, composants, architecture',
    iconBg: '#eef2ff',
    badge: 'active' as const,
    color: '#6366f1',
    isDisabled: false,
    icon: (
      <svg width='18' height='18' viewBox='0 0 18 18' fill='none'>
        <path
          d='M4 14V6l5-2 5 2v8'
          stroke='#6366f1'
          strokeWidth='1.3'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <rect x='7' y='10' width='4' height='4' rx='0.5' stroke='#6366f1' strokeWidth='1.2' />
      </svg>
    ),
  },
  {
    id: 'debug',
    name: 'Debug',
    description: 'Erreurs, logs, fixes',
    iconBg: '#fef3c7',
    badge: 'active' as const,
    color: '#d97706',
    isDisabled: false,
    icon: (
      <svg width='18' height='18' viewBox='0 0 18 18' fill='none'>
        <circle cx='9' cy='9' r='5' stroke='#d97706' strokeWidth='1.3' />
        <path d='M9 6v3l2 2' stroke='#d97706' strokeWidth='1.3' strokeLinecap='round' />
      </svg>
    ),
  },
  {
    id: 'uiux',
    name: 'UI/UX',
    description: 'Design, composants visuels',
    iconBg: '#f0fdf4',
    badge: 'soon' as const,
    color: '#22c55e',
    isDisabled: true,
    icon: (
      <svg width='18' height='18' viewBox='0 0 18 18' fill='none'>
        <rect x='3' y='3' width='12' height='12' rx='2' stroke='#86efac' strokeWidth='1.3' />
        <path d='M6 9h6M9 6v6' stroke='#86efac' strokeWidth='1.3' strokeLinecap='round' />
      </svg>
    ),
  },
  {
    id: 'qa',
    name: 'QA',
    description: 'Tests, qualité, couverture',
    iconBg: '#fdf4ff',
    badge: 'active' as const,
    color: '#a855f7',
    isDisabled: false,
    icon: (
      <svg width='18' height='18' viewBox='0 0 18 18' fill='none'>
        <path
          d='M4 14l3-3 2 2 5-6'
          stroke='#d8b4fe'
          strokeWidth='1.3'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    ),
  },
  {
    id: 'designer',
    name: 'Designer',
    description: 'Maquettes, style guide',
    iconBg: '#fff7ed',
    badge: 'soon' as const,
    color: '#f97316',
    isDisabled: true,
    icon: (
      <svg width='18' height='18' viewBox='0 0 18 18' fill='none'>
        <circle cx='9' cy='7' r='3' stroke='#fb923c' strokeWidth='1.3' />
        <path
          d='M3 15c0-3.3 2.7-6 6-6s6 2.7 6 6'
          stroke='#fb923c'
          strokeWidth='1.3'
          strokeLinecap='round'
        />
      </svg>
    ),
  },
  {
    id: 'orchestrator',
    name: 'Orchestrateur',
    description: 'Coordonne les agents',
    iconBg: '#f0f9ff',
    badge: 'soon' as const,
    color: '#0ea5e9',
    isDisabled: true,
    icon: (
      <svg width='18' height='18' viewBox='0 0 18 18' fill='none'>
        <path
          d='M9 3v3M9 12v3M3 9h3M12 9h3'
          stroke='#38bdf8'
          strokeWidth='1.3'
          strokeLinecap='round'
        />
        <circle cx='9' cy='9' r='2.5' stroke='#38bdf8' strokeWidth='1.3' />
      </svg>
    ),
  },
];

const agentChipColors: Record<string, 'indigo' | 'amber' | 'green' | 'purple' | 'sky'> = {
  dev: 'indigo',
  debug: 'amber',
  qa: 'purple',
};

export default function Home() {
  const [selectedAgentId, setSelectedAgentId] = useState('dev');
  const [fileContent, setFileContent] = useState<FileContent | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState('1');
  const [error, setError] = useState<string | null>(null);

  //mapping agent id to api route
  const agentRoutes: Record<string, string> = {
    dev: '/api/agents/dev',
    debug: '/api/agents/debug',
    qa: '/api/agents/qa',
  };

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: agentRoutes[selectedAgentId] || '/api/agents/dev',
    body: { fileContent },
    onError: (error) => {
      console.error('useChat error:', error);
      if (error.message.includes('rate limit') || error.message.includes('429')) {
        setError('Limite de requêtes atteinte — attends quelques secondes et réessaie.');
      } else if (error.message.includes('403')) {
        setError('Accès refusé — vérifie ta connexion réseau ou désactive ton VPN.');
      } else {
        setError('Une erreur est survenue — réessaie.');
      }
    },
    onFinish: () => {
      if (messages.length === 0) {
        const title = input.slice(0, 40) || 'Nouvelle conversation';
        const newConv: Conversation = {
          id: activeConversationId,
          title,
          agentName: `Agent ${selectedAgent?.name || 'Dev'}`,
          agentColor: selectedAgent?.color || '#6366f1',
          date: 'maintenant',
        };
        setConversations((prev) => [newConv, ...prev.filter((c) => c.id !== activeConversationId)]);
      }
    },
  });

  useEffect(() => {
    const saved = localStorage.getItem('agent-history');
    const savedConvs = localStorage.getItem('agent-conversations');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
    if (savedConvs) {
      try {
        setConversations(JSON.parse(savedConvs));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('agent-history', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('agent-conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  const handleClear = () => {
    setMessages([]);
    localStorage.removeItem('agent-history');
  };

  const handleNewConversation = () => {
    handleClear();
    setActiveConversationId(Date.now().toString());
    setFileContent(null);
  };

  const selectedAgent = AGENTS.find((a) => a.id === selectedAgentId);

  return (
    <div className='flex flex-col h-screen bg-gray-50'>
      <Topbar
        activeAgents={
          selectedAgent
            ? [
                {
                  name: `Agent ${selectedAgent.name}`,
                  color: agentChipColors[selectedAgentId] || 'indigo',
                },
              ]
            : []
        }
        isDark={isDark}
        onThemeToggle={() => setIsDark(!isDark)}
        onClear={handleClear}
      />

      <div className='flex flex-1 overflow-hidden'>
        <Sidebar
          agents={AGENTS}
          selectedAgentId={selectedAgentId}
          conversations={conversations}
          activeConversationId={activeConversationId}
          onAgentSelect={setSelectedAgentId}
          onConversationSelect={(id) => setActiveConversationId(id)}
          onNewConversation={handleNewConversation}
        />

        <div className='flex flex-col flex-1 overflow-hidden'>
          <ChatMessages messages={messages} isLoading={isLoading} />
          {error && (
            <div className='mx-5 mb-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between'>
              <p className='text-xs text-red-600'>{error}</p>
              <button
                onClick={() => setError(null)}
                className='text-red-400 hover:text-red-600 text-sm ml-3'
              >
                ×
              </button>
            </div>
          )}
          <ChatInput
            input={input}
            isLoading={isLoading}
            fileContent={fileContent}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onFileChange={setFileContent}
          />
        </div>
      </div>
    </div>
  );
}
