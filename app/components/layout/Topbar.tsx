'use client';

import { cn } from '@/app/lib/utils';
import AgentChip from '../agents/AgentChip';

interface ActiveAgent {
  name: string;
  color: 'indigo' | 'amber' | 'green' | 'purple' | 'sky';
}

interface TopbarProps {
  activeAgents: ActiveAgent[];
  isDark: boolean;
  onThemeToggle: () => void;
  onClear: () => void;
}

export default function Topbar({ activeAgents, isDark, onThemeToggle, onClear }: TopbarProps) {
  return (
    <div className='h-14 bg-white border-b border-gray-100 px-6 flex items-center justify-between flex-shrink-0'>
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2.5'>
          <div className='w-8 h-8 bg-gray-950 rounded-xl flex items-center justify-center'>
            <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
              <rect x='2' y='2' width='5' height='5' rx='1.5' fill='white' />
              <rect x='9' y='2' width='5' height='5' rx='1.5' fill='white' fillOpacity='0.5' />
              <rect x='2' y='9' width='5' height='5' rx='1.5' fill='white' fillOpacity='0.5' />
              <rect x='9' y='9' width='5' height='5' rx='1.5' fill='white' fillOpacity='0.3' />
            </svg>
          </div>
          <span className='text-sm font-bold text-gray-950 tracking-tight'>
            DevAgent<span className='font-normal text-gray-400'>OS</span>
          </span>
        </div>

        <div className='w-px h-4 bg-gray-200' />

        <div className='flex items-center gap-1.5'>
          {activeAgents.length === 0 ? (
            <span className='text-xs text-gray-400'>No agent selected</span>
          ) : (
            activeAgents.map((agent) => (
              <AgentChip key={agent.name} name={agent.name} color={agent.color} />
            ))
          )}
        </div>
      </div>

      <div className='flex items-center gap-3'>
        <div className='flex items-center gap-1.5'>
          <div className='w-1.5 h-1.5 rounded-full bg-emerald-400' />
          <span className='text-xs text-gray-400'>
            {activeAgents.length} active agent{activeAgents.length > 1 ? 's' : ''}
          </span>
        </div>

        <div className='w-1.5 h-1.5 rounded-full bg-blue-500' />

        <button
          onClick={onThemeToggle}
          className={cn(
            'w-9 h-5 rounded-full relative transition-colors duration-200',
            isDark ? 'bg-gray-950' : 'bg-gray-200'
          )}
        >
          <div
            className={cn(
              'w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform duration-200 shadow-sm',
              isDark ? 'translate-x-4' : 'translate-x-0.5'
            )}
          />
        </button>

        <button
          onClick={onClear}
          className='text-xs text-gray-400 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors'
        >
          Clear
        </button>
      </div>
    </div>
  );
}
