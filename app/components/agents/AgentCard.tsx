import { cn } from '@/app/lib/utils';

interface AgentCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  badge: 'active' | 'ready' | 'soon';
  isSelected?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
}

const badgeConfig = {
  active: { label: 'Actif', className: 'bg-indigo-50 text-indigo-600' },
  ready: { label: 'Prêt', className: 'bg-green-50 text-green-600' },
  soon: { label: 'Bientôt', className: 'bg-gray-100 text-gray-400' },
};

export default function AgentCard({
  name,
  description,
  icon,
  iconBg,
  badge,
  isSelected = false,
  isDisabled = false,
  onClick,
}: AgentCardProps) {
  return (
    <div
      onClick={isDisabled ? undefined : onClick}
      className={cn(
        'p-3 rounded-xl border-2 transition-all duration-150',
        isDisabled
          ? 'opacity-45 cursor-not-allowed border-gray-100'
          : 'cursor-pointer hover:border-indigo-200 hover:bg-indigo-50/30',
        isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white'
      )}
    >
      <div
        className='w-8 h-8 rounded-lg flex items-center justify-center mb-2'
        style={{ background: iconBg }}
      >
        {icon}
      </div>
      <p className='text-xs font-semibold text-gray-900 mb-0.5'>{name}</p>
      <p className='text-[10px] text-gray-400 leading-snug'>{description}</p>
      <span
        className={cn(
          'inline-block text-[9px] font-semibold px-1.5 py-0.5 rounded-full mt-1.5',
          badgeConfig[badge].className
        )}
      >
        {badgeConfig[badge].label}
      </span>
    </div>
  );
}
