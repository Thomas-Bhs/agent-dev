import { cn } from '@/app/lib/utils'

interface AgentChipProps {
  name: string
  color: 'indigo' | 'amber' | 'green' | 'purple' | 'sky'
}

const colorConfig = {
  indigo: { dot: 'bg-indigo-500', chip: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
  amber: { dot: 'bg-amber-500', chip: 'bg-amber-50 text-amber-600 border-amber-200' },
  green: { dot: 'bg-green-500', chip: 'bg-green-50 text-green-600 border-green-200' },
  purple: { dot: 'bg-purple-500', chip: 'bg-purple-50 text-purple-600 border-purple-200' },
  sky: { dot: 'bg-sky-500', chip: 'bg-sky-50 text-sky-600 border-sky-200' },
}

export default function AgentChip({ name, color }: AgentChipProps) {
  return (
    <div className={cn(
      'flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border',
      colorConfig[color].chip
    )}>
      <div className={cn('w-1.5 h-1.5 rounded-full', colorConfig[color].dot)} />
      {name}
    </div>
  )
}