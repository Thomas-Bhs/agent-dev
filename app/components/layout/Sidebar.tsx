'use client';

import { cn } from '@/app/lib/utils';
import AgentCard from '../agents/AgentCard';
import type { Theme } from '@/app/lib/theme';
import { themes } from '@/app/lib/theme';

interface Conversation {
  id: string;
  title: string;
  agentName: string;
  agentColor: string;
  date: string;
}

interface Agent {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  badge: 'active' | 'ready' | 'soon';
  color: string;
  isDisabled?: boolean;
}

interface SidebarProps {
  agents: Agent[];
  selectedAgentId: string;
  conversations: Conversation[];
  activeConversationId: string;
  onAgentSelect: (id: string) => void;
  onConversationSelect: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onDeleteAllConversations: () => void;
  theme: Theme;
}

export default function Sidebar({
  agents,
  selectedAgentId,
  conversations,
  activeConversationId,
  onAgentSelect,
  onConversationSelect,
  onNewConversation,
  onDeleteConversation,
  onDeleteAllConversations,
  theme,
}: SidebarProps) {
  const t = themes[theme];
  const isFallout = theme === 'fallout';

  return (
    <div
      className='w-64 flex flex-col overflow-hidden flex-shrink-0'
      style={{
        background: t.surface,
        borderRight: `1px solid ${t.border}`,
      }}
    >
      <div className='px-4 pt-4 pb-2'>
        <p
          className='text-[10px] font-bold uppercase tracking-widest mb-3'
          style={{ color: isFallout ? t.border : '#9ca3af' }}
        >
          {isFallout ? '// AGENTS' : 'Agents'}
        </p>
        <div className='grid grid-cols-2 gap-2'>
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              name={agent.name}
              description={agent.description}
              icon={agent.icon}
              iconBg={agent.iconBg}
              badge={agent.badge}
              isSelected={selectedAgentId === agent.id}
              isDisabled={agent.isDisabled}
              onClick={() => onAgentSelect(agent.id)}
              theme={theme}
              agentId={agent.id}
            />
          ))}
        </div>
      </div>

      <div className='mx-4 my-3 h-px' style={{ background: t.border }} />

      <div className='px-4 flex items-center justify-between mb-2'>
        <p
          className='text-[10px] font-bold uppercase tracking-widest'
          style={{ color: isFallout ? t.border : '#9ca3af' }}
        >
          {isFallout ? '// HISTORY' : 'History'}
        </p>
        <button
          onClick={onNewConversation}
          className='text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-colors'
          style={{
            background: isFallout ? t.border : '#0f0f1a',
            color: isFallout ? t.bg : 'white',
          }}
        >
          + New
        </button>
      </div>

      <div className='flex-1 overflow-y-auto px-2'>
        {conversations.length === 0 ? (
          <p className='text-xs px-2 py-3' style={{ color: t.textSecondary }}>
            {isFallout ? '> No logs found_' : 'No conversations yet'}
          </p>
        ) : (
          <>
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => onConversationSelect(conv.id)}
                className='px-3 py-2.5 rounded-xl cursor-pointer flex items-center gap-2 mb-1 transition-colors group'
                style={{
                  background:
                    activeConversationId === conv.id
                      ? isFallout
                        ? `${t.border}22`
                        : '#0f0f1a'
                      : 'transparent',
                  border:
                    activeConversationId === conv.id && isFallout
                      ? `1px solid ${t.border}`
                      : '1px solid transparent',
                }}
              >
                <div
                  className='w-1.5 h-1.5 rounded-full flex-shrink-0'
                  style={{ background: isFallout ? t.border : conv.agentColor }}
                />
                <div className='flex-1 overflow-hidden'>
                  <p
                    className='text-xs truncate font-medium'
                    style={{
                      color:
                        activeConversationId === conv.id
                          ? isFallout
                            ? t.border
                            : 'white'
                          : t.text,
                    }}
                  >
                    {conv.title}
                  </p>
                  <p className='text-[10px] mt-0.5' style={{ color: t.textSecondary }}>
                    {conv.agentName} · {conv.date}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conv.id);
                  }}
                  className='opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg'
                >
                  <svg width='12' height='12' viewBox='0 0 12 12' fill='none'>
                    <path
                      d='M2 3h8M5 3V2h2v1M4 3v6h4V3'
                      stroke={isFallout ? t.border : '#ef4444'}
                      strokeWidth='1'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </button>
              </div>
            ))}

            <button
              onClick={onDeleteAllConversations}
              className='w-full mt-2 text-[10px] py-1.5 rounded-lg transition-colors'
              style={{ color: isFallout ? t.border : '#ef4444' }}
            >
              {isFallout ? '> Clear all logs_' : 'Clear all conversations'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
