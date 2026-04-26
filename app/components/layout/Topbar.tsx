'use client';
import AgentChip from '../agents/AgentChip';
import { Gauge } from 'lucide-react';
import type { Theme } from '@/app/lib/theme';
import { themes } from '@/app/lib/theme';

interface ActiveAgent {
  name: string;
  color: 'indigo' | 'amber' | 'green' | 'purple' | 'sky';
}

interface TopbarProps {
  activeAgents: ActiveAgent[];
  isDark: boolean;
  onThemeToggle: () => void;
  onClear: () => void;
  onSettings: () => void;
  theme: Theme;
}

export default function Topbar({
  activeAgents,
  isDark,
  onThemeToggle,
  onClear,
  onSettings,
  theme,
}: TopbarProps) {
  const t = themes[theme];
  const isFallout = theme === 'fallout';

  return (
    <div
      className='h-14 px-6 flex items-center justify-between flex-shrink-0'
      style={{
        background: t.surface,
        borderBottom: `1px solid ${t.border}`,
      }}
    >
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2.5'>
          <div
            className='w-8 h-8 rounded-xl flex items-center justify-center'
            style={{ background: isFallout ? t.border : '#0f0f1a' }}
          >
            <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
              <rect x='2' y='2' width='5' height='5' rx='1.5' fill={isFallout ? t.bg : 'white'} />
              <rect
                x='9'
                y='2'
                width='5'
                height='5'
                rx='1.5'
                fill={isFallout ? t.bg : 'white'}
                fillOpacity='0.5'
              />
              <rect
                x='2'
                y='9'
                width='5'
                height='5'
                rx='1.5'
                fill={isFallout ? t.bg : 'white'}
                fillOpacity='0.5'
              />
              <rect
                x='9'
                y='9'
                width='5'
                height='5'
                rx='1.5'
                fill={isFallout ? t.bg : 'white'}
                fillOpacity='0.3'
              />
            </svg>
          </div>
          <span
            className='text-sm font-bold tracking-tight'
            style={{
              color: isFallout ? t.border : t.text,
              fontFamily: isFallout ? 'monospace' : 'inherit',
            }}
          >
            DevAgent<span style={{ color: t.textSecondary, fontWeight: 400 }}>OS</span>
          </span>
        </div>

        <div className='w-px h-4' style={{ background: t.border }} />

        <div className='flex items-center gap-1.5'>
          {activeAgents.length === 0 ? (
            <span className='text-xs' style={{ color: t.textSecondary }}>
              No agent selected
            </span>
          ) : (
            activeAgents.map((agent) =>
              isFallout ? (
                <div
                  key={agent.name}
                  className='flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded fallout-selected'
                  style={{
                    background: `${t.border}15`,
                    border: `1px solid ${t.border}`,
                    color: t.border,
                    fontFamily: 'monospace',
                  }}
                >
                  <div
                    className='w-1.5 h-1.5 rounded-full animate-pulse'
                    style={{ background: t.border }}
                  />
                  {`> ${agent.name.toUpperCase()}_`}
                </div>
              ) : (
                <AgentChip key={agent.name} name={agent.name} color={agent.color} />
              )
            )
          )}
        </div>
      </div>

      <div className='flex items-center gap-3'>
        <button
          onClick={onSettings}
          className='w-8 h-8 flex items-center justify-center rounded-xl transition-colors'
          style={{ color: t.textSecondary }}
        >
          <Gauge size={15} />
        </button>

        <button
          onClick={onThemeToggle}
          className='w-9 h-5 rounded-full relative transition-colors duration-200'
          style={{ background: isFallout ? t.border : '#e5e7eb' }}
          title={isFallout ? 'Switch to Spatial' : 'Switch to Fallout'}
        >
          <div
            className='w-4 h-4 rounded-full absolute top-0.5 transition-transform duration-200 shadow-sm'
            style={{
              background: isFallout ? t.bg : 'white',
              transform: isFallout ? 'translateX(16px)' : 'translateX(2px)',
            }}
          />
        </button>

        <button
          onClick={onClear}
          className='text-xs px-3 py-1.5 rounded-lg transition-colors'
          style={{
            color: t.textSecondary,
            border: `1px solid ${t.border}`,
            background: 'transparent',
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
