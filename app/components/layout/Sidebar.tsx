'use client'

import { cn } from '@/app/lib/utils'
import AgentCard from '../agents/AgentCard'

interface Conversation {
  id: string
  title: string
  agentName: string
  agentColor: string
  date: string
}

interface Agent {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  iconBg: string
  badge: 'active' | 'ready' | 'soon'
  color: string
  isDisabled?: boolean
}

interface SidebarProps {
  agents: Agent[]
  selectedAgentId: string
  conversations: Conversation[]
  activeConversationId: string
  onAgentSelect: (id: string) => void
  onConversationSelect: (id: string) => void
  onNewConversation: () => void
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
    <div className="w-56 bg-white border-r border-gray-100 flex flex-col overflow-hidden flex-shrink-0">

      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
          Agents
        </p>
      </div>

      <div className="p-3 grid grid-cols-2 gap-2">
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

      <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-between">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
          Historique
        </p>
        <button
          onClick={onNewConversation}
          className="text-[10px] bg-gray-900 text-white px-2 py-1 rounded-md hover:bg-gray-700 transition-colors"
        >
          + New
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <p className="text-xs text-gray-400 px-4 py-3">Aucune conversation</p>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => onConversationSelect(conv.id)}
              className={cn(
                'px-4 py-2.5 cursor-pointer flex items-center gap-2.5 hover:bg-gray-50 transition-colors',
                activeConversationId === conv.id && 'bg-indigo-50'
              )}
            >
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: conv.agentColor }}
              />
              <div className="flex-1 overflow-hidden">
                <p className={cn(
                  'text-xs truncate',
                  activeConversationId === conv.id
                    ? 'text-indigo-600 font-medium'
                    : 'text-gray-600'
                )}>
                  {conv.title}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {conv.agentName} · {conv.date}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}