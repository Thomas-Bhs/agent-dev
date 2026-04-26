import { cn } from '@/app/lib/utils';
import type { Theme } from '@/app/lib/theme';
import { themes } from '@/app/lib/theme';
import Image from 'next/image';

interface AgentCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  badge: 'active' | 'ready' | 'soon';
  isSelected?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
  theme: Theme;
  agentId: string;
}

const badgeConfig = {
  active: { label: 'Active', className: 'bg-emerald-50 text-emerald-600' },
  ready: { label: 'Ready', className: 'bg-blue-50 text-blue-600' },
  soon: { label: 'Soon', className: 'bg-gray-100 text-gray-400' },
};

const falloutBadgeConfig = {
  active: { label: 'ONLINE' },
  ready: { label: 'READY' },
  soon: { label: 'LOCKED' },
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
  theme,
  agentId,
}: AgentCardProps) {
  const t = themes[theme];
  const isFallout = theme === 'fallout';

  if (isFallout) {
    return (
      <div
        onClick={isDisabled ? undefined : onClick}
        className={cn(
          'p-2 rounded-2xl transition-all duration-150 relative overflow-hidden',
          isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-105',
          isSelected && isFallout ? 'fallout-selected' : ''
        )}
        style={{
          background: isSelected ? `${t.border}20` : t.surface,
          border: `1px solid ${isSelected ? t.border : `${t.border}30`}`,
        }}
      >
        <div className='relative w-full h-28 mb-2'>
          <Image
            src={`/agents/${agentId}.png`}
            alt={name}
            fill
            className='object-contain'
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>

        <p
          className='text-[10px] font-bold text-center uppercase tracking-wider'
          style={{ color: t.border, fontFamily: 'monospace' }}
        >
          {name}
        </p>
      </div>
    );
  }

  return (
    <div
      onClick={isDisabled ? undefined : onClick}
      className={cn(
        'p-3 rounded-2xl border transition-all duration-150',
        isDisabled ? 'opacity-40 cursor-not-allowed border-gray-100 bg-white' : 'cursor-pointer',
        isSelected
          ? 'border-gray-950 bg-gray-950'
          : 'border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm'
      )}
    >
      <div
        className={cn(
          'w-8 h-8 rounded-xl flex items-center justify-center mb-2.5',
          isSelected ? 'bg-white/10' : ''
        )}
        style={isSelected ? {} : { background: iconBg }}
      >
        {icon}
      </div>

      <p
        className={cn(
          'text-xs font-bold mb-0.5 tracking-tight',
          isSelected ? 'text-white' : 'text-gray-900'
        )}
      >
        {name}
      </p>

      <p
        className={cn(
          'text-[10px] leading-snug mb-2',
          isSelected ? 'text-gray-400' : 'text-gray-400'
        )}
      >
        {description}
      </p>

      <span
        className={cn(
          'inline-block text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide',
          isSelected ? 'bg-white/10 text-white/60' : badgeConfig[badge].className
        )}
      >
        {badgeConfig[badge].label}
      </span>
    </div>
  );
}
