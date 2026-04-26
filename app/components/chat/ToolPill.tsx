import { cn } from '@/app/lib/utils';
import type { Theme } from '@/app/lib/theme';
import { themes } from '@/app/lib/theme';

interface ToolPillProps {
  toolName: string;
  state: 'running' | 'completed';
  theme: Theme;
}

export default function ToolPill({ toolName, state, theme }: ToolPillProps) {
  const t = themes[theme];
  const isFallout = theme === 'fallout';

  if (isFallout) {
    return (
      <div
        className='inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded mb-2'
        style={{
          background: `${t.border}15`,
          border: `1px solid ${t.border}`,
          color: t.border,
          fontFamily: 'monospace',
        }}
      >
        <div
          className={cn('w-1.5 h-1.5 rounded-full', state === 'running' && 'animate-pulse')}
          style={{ background: t.border }}
        />
        {state === 'running'
          ? `> EXECUTING ${toolName.toUpperCase()}..._`
          : `> ${toolName.toUpperCase()} DONE ✓`}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full mb-2',
        state === 'running' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'
      )}
    >
      <div
        className={cn(
          'w-1.5 h-1.5 rounded-full',
          state === 'running' ? 'bg-white animate-pulse' : 'bg-gray-300'
        )}
      />
      {toolName} — {state === 'running' ? 'running...' : 'completed'}
    </div>
  );
}
