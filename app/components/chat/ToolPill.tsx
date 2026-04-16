import { cn } from '@/app/lib/utils'

interface ToolPillProps {
  toolName: string
  state: 'running' | 'completed'
}

const stateConfig = {
  running: {
    label: 'en cours...',
    className: 'bg-indigo-50 text-indigo-500 border-indigo-200',
    dotClassName: 'bg-indigo-400 animate-pulse',
  },
  completed: {
    label: 'terminé',
    className: 'bg-gray-50 text-gray-400 border-gray-200',
    dotClassName: 'bg-gray-300',
  },
}

export default function ToolPill({ toolName, state }: ToolPillProps) {
  return (
    <div className={cn(
      'inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-full border mb-1.5',
      stateConfig[state].className
    )}>
      <div className={cn('w-1.5 h-1.5 rounded-full', stateConfig[state].dotClassName)} />
      {toolName} — {stateConfig[state].label}
    </div>
  )
}