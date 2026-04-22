'use client';

import { cn } from '@/app/lib/utils';
import AgentCard from '../agents/AgentCard';

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
}

export default function Sidebar({
  agents,
  selectedAgentId,
  conversations,
  activeConversationId,
  onAgentSelect,
  onConversationSelect,
  onNewConversation,
}: SidebarProps) {
  return (
    <div className='w-64 bg-white border-r border-gray-100 flex flex-col overflow-hidden flex-shrink-0'>
      <div className='px-4 pt-4 pb-2'>
        <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3'>Agents</p>
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
            />
          ))}
        </div>
      </div>

      <div className='mx-4 my-3 h-px bg-gray-100' />

      <div className='px-4 flex items-center justify-between mb-2'>
        <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>History</p>
        <button
          onClick={onNewConversation}
          className='text-[10px] font-semibold bg-gray-950 text-white px-2.5 py-1 rounded-lg hover:bg-gray-800 transition-colors'
        >
          + New
        </button>
      </div>

      <div className='flex-1 overflow-y-auto px-2'>
        {conversations.length === 0 ? (
          <p className='text-xs text-gray-400 px-2 py-3'>No conversations yet</p>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => onConversationSelect(conv.id)}
              className={cn(
                'px-3 py-2.5 rounded-xl cursor-pointer flex items-center gap-2.5 mb-1 transition-colors',
                activeConversationId === conv.id ? 'bg-gray-950' : 'hover:bg-gray-50'
              )}
            >
              <div
                className='w-1.5 h-1.5 rounded-full flex-shrink-0'
                style={{ background: conv.agentColor }}
              />
              <div className='flex-1 overflow-hidden'>
                <p
                  className={cn(
                    'text-xs truncate font-medium',
                    activeConversationId === conv.id ? 'text-white' : 'text-gray-700'
                  )}
                >
                  {conv.title}
                </p>
                <p
                  className={cn(
                    'text-[10px] mt-0.5',
                    activeConversationId === conv.id ? 'text-gray-400' : 'text-gray-400'
                  )}
                >
                  {conv.agentName} · {conv.date}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
