import { cn } from '@/app/lib/utils';

interface ToolPillProps {
  toolName: string;
  state: 'running' | 'completed';
}

const stateConfig = {
  running: {
    label: 'running...',
    className: 'bg-blue-500 text-white',
    dotClassName: 'bg-white animate-pulse',
  },
  completed: {
    label: 'completed',
    className: 'bg-gray-100 text-gray-400',
    dotClassName: 'bg-gray-300',
  },
};

export default function ToolPill({ toolName, state }: ToolPillProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full mb-2',
        stateConfig[state].className
      )}
    >
      <div className={cn('w-1.5 h-1.5 rounded-full', stateConfig[state].dotClassName)} />
      {toolName} — {stateConfig[state].label}
    </div>
  );
}
