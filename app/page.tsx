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
    description: 'Code, components, architecture',
    iconBg: '#dbeafe',
    badge: 'active' as const,
    color: '#2563eb',
    isDisabled: false,
    icon: (
      <svg width='18' height='18' viewBox='0 0 18 18' fill='none'>
        <path
          d='M5 7L2 9l3 2'
          stroke='#2563eb'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M13 7l3 2-3 2'
          stroke='#2563eb'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path d='M10.5 4l-3 10' stroke='#2563eb' strokeWidth='1.5' strokeLinecap='round' />
      </svg>
    ),
  },
  {
    id: 'debug',
    name: 'Debug',
    description: 'Errors, logs, fixes',
    iconBg: '#fee2e2',
    badge: 'active' as const,
    color: '#dc2626',
    isDisabled: false,
    icon: (
      <svg width='18' height='18' viewBox='0 0 18 18' fill='none'>
        <path
          d='M9 3a4 4 0 014 4v2a4 4 0 01-8 0V7a4 4 0 014-4z'
          stroke='#dc2626'
          strokeWidth='1.5'
        />
        <path
          d='M5 8H2M16 8h-3M9 13v2M6 15.5h6'
          stroke='#dc2626'
          strokeWidth='1.5'
          strokeLinecap='round'
        />
        <path d='M5.5 5L3 3M12.5 5L15 3' stroke='#dc2626' strokeWidth='1.5' strokeLinecap='round' />
      </svg>
    ),
  },
  {
    id: 'uiux',
    name: 'UI/UX',
    description: 'Design, visual components',
    iconBg: '#fae8ff',
    badge: 'soon' as const,
    color: '#a21caf',
    isDisabled: true,
    icon: (
      <svg width='18' height='18' viewBox='0 0 18 18' fill='none'>
        <rect x='2' y='2' width='6' height='6' rx='1.5' stroke='#a21caf' strokeWidth='1.5' />
        <rect
          x='10'
          y='2'
          width='6'
          height='6'
          rx='1.5'
          stroke='#a21caf'
          strokeWidth='1.5'
          strokeDasharray='2 1'
        />
        <rect
          x='2'
          y='10'
          width='6'
          height='6'
          rx='1.5'
          stroke='#a21caf'
          strokeWidth='1.5'
          strokeDasharray='2 1'
        />
        <rect x='10' y='10' width='6' height='6' rx='1.5' stroke='#a21caf' strokeWidth='1.5' />
      </svg>
    ),
  },
  {
    id: 'qa',
    name: 'QA',
    description: 'Tests, quality, coverage',
    iconBg: '#dcfce7',
    badge: 'active' as const,
    color: '#16a34a',
    isDisabled: false,
    icon: (
      <svg width='18' height='18' viewBox='0 0 18 18' fill='none'>
        <path
          d='M3 9l4 4 8-8'
          stroke='#16a34a'
          strokeWidth='1.8'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <circle cx='9' cy='9' r='7' stroke='#16a34a' strokeWidth='1.5' />
      </svg>
    ),
  },
  {
    id: 'designer',
    name: 'Designer',
    description: 'Mockups, style guide',
    iconBg: '#fff7ed',
    badge: 'soon' as const,
    color: '#ea580c',
    isDisabled: true,
    icon: (
      <svg width='18' height='18' viewBox='0 0 18 18' fill='none'>
        <path
          d='M3 15l3-1 8-8-2-2-8 8-1 3z'
          stroke='#ea580c'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path d='M12 4l2 2' stroke='#ea580c' strokeWidth='1.5' strokeLinecap='round' />
        <circle cx='5.5' cy='12.5' r='1' fill='#ea580c' />
      </svg>
    ),
  },
  {
    id: 'orchestrator',
    name: 'Orchestrator',
    description: 'Coordinates agents',
    iconBg: '#e0f2fe',
    badge: 'active' as const,
    color: '#0284c7',
    isDisabled: false,
    icon: (
      <svg width='18' height='18' viewBox='0 0 18 18' fill='none'>
        <circle cx='9' cy='4' r='2' stroke='#0284c7' strokeWidth='1.5' />
        <circle cx='3' cy='14' r='2' stroke='#0284c7' strokeWidth='1.5' />
        <circle cx='15' cy='14' r='2' stroke='#0284c7' strokeWidth='1.5' />
        <path
          d='M9 6v3M9 9l-4.5 3M9 9l4.5 3'
          stroke='#0284c7'
          strokeWidth='1.5'
          strokeLinecap='round'
        />
      </svg>
    ),
  },
];

const agentChipColors: Record<string, 'indigo' | 'amber' | 'green' | 'purple' | 'sky'> = {
  dev: 'indigo',
  debug: 'amber',
  qa: 'purple',
  orchestrator: 'sky',
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
    orchestrator: '/api/agents/orchestrator',
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
    <div className='flex flex-col h-screen bg-[#f5f5f7]'>
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
          onAgentSelect={(id) => {
            setSelectedAgentId(id);
            handleClear();
          }}
          onConversationSelect={(id) => setActiveConversationId(id)}
          onNewConversation={handleNewConversation}
        />

        <div className='flex flex-col flex-1 overflow-hidden bg-[#f5f5f7]'>
          <div className='flex-1 overflow-hidden flex flex-col mx-4 my-4 bg-white rounded-3xl border border-gray-200/80 shadow-sm'>
            <ChatMessages messages={messages} isLoading={isLoading} />
            {error && (
              <div className='mx-4 mb-3 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-between'>
                <p className='text-xs text-red-500'>{error}</p>
                <button
                  onClick={() => setError(null)}
                  className='text-red-300 hover:text-red-500 text-sm ml-3 transition-colors'
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
    </div>
  );
}
