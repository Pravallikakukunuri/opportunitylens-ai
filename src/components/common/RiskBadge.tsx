import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';
import type { RiskLevel } from '../../types';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md', showIcon = true }) => {
  const configs = {
    low: {
      label: 'Low Risk',
      sublabel: 'Standard Indicators',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/20',
      icon: ShieldCheck,
      iconColor: 'text-emerald-600',
    },
    medium: {
      label: 'Medium Caution',
      sublabel: 'Review Ambiguities',
      bg: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-600/20',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
    },
    high: {
      label: 'High Suspicion',
      sublabel: 'Scam Patterns Detected',
      bg: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-600/20',
      icon: ShieldAlert,
      iconColor: 'text-rose-600',
    },
  };

  const config = configs[level] || configs.medium;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold',
  }[size];

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-xs ring-1 ring-inset ${config.bg} ${sizeClasses} transition-all`}
    >
      {showIcon && <Icon className={`${iconSizes} ${config.iconColor} shrink-0`} />}
      <span>{config.label}</span>
    </span>
  );
};
