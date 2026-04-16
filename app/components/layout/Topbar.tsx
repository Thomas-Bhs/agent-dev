'use client'

import { cn } from '@/app/lib/utils'
import AgentChip from '../agents/AgentChip'

interface ActiveAgent {
  name: string
  color: 'indigo' | 'amber' | 'green' | 'purple' | 'sky'
}

interface TopbarProps {
  activeAgents: ActiveAgent[]
  isDark: boolean
  onThemeToggle: () => void
  onClear: () => void
}

export default function Topbar({
  activeAgents,
  isDark,
  onThemeToggle,
  onClear,
}: TopbarProps) {
  return (
    <div className="h-14 bg-white border-b border-gray-100 px-5 flex items-center justify-between flex-shrink-0">

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1.5" y="1.5" width="4" height="4" rx="1" fill="white"/>
              <rect x="8.5" y="1.5" width="4" height="4" rx="1" fill="white" fillOpacity="0.5"/>
              <rect x="1.5" y="8.5" width="4" height="4" rx="1" fill="white" fillOpacity="0.5"/>
              <rect x="8.5" y="8.5" width="4" height="4" rx="1" fill="white" fillOpacity="0.3"/>
            </svg>
          </div>
          <span className="text-sm font-bold text-gray-900 tracking-tight">
            DevAgent<span className="font-normal text-gray-400">OS</span>
          </span>
        </div>

        <div className="w-px h-4 bg-gray-200" />

        <div className="flex items-center gap-1.5">
          {activeAgents.length === 0 ? (
            <span className="text-xs text-gray-400">Aucun agent sélectionné</span>
          ) : (
            activeAgents.map((agent) => (
              <AgentChip key={agent.name} name={agent.name} color={agent.color} />
            ))
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span className="text-xs text-gray-400">
            {activeAgents.length} agent{activeAgents.length > 1 ? 's' : ''} actif{activeAgents.length > 1 ? 's' : ''}
          </span>
        </div>

        <div className="w-px h-4 bg-gray-200" />

        <button
          onClick={onThemeToggle}
          className={cn(
            'w-8 h-4.5 rounded-full relative transition-colors',
            isDark ? 'bg-indigo-500' : 'bg-gray-200'
          )}
        >
          <div className={cn(
            'w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-transform',
            isDark ? 'translate-x-4' : 'translate-x-0.5'
          )} />
        </button>

        <button
          onClick={onClear}
          className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 px-2.5 py-1 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Effacer
        </button>
      </div>
    </div>
  )
}