import React from 'react';
import { Target } from 'lucide-react';

interface MatchScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const MatchScoreBadge: React.FC<MatchScoreBadgeProps> = ({ score, size = 'md', showLabel = true }) => {
  // Score styling tiers
  let colorStyles = {
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    bar: 'bg-emerald-500',
    text: 'text-emerald-700',
    tierLabel: 'High Fit',
  };

  if (score < 40) {
    colorStyles = {
      bg: 'bg-slate-100 text-slate-800 border-slate-200',
      bar: 'bg-slate-500',
      text: 'text-slate-600',
      tierLabel: 'Large Gap',
    };
  } else if (score < 70) {
    colorStyles = {
      bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      bar: 'bg-indigo-600',
      text: 'text-indigo-700',
      tierLabel: 'Moderate Fit',
    };
  }

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${colorStyles.bg}`}>
        <Target className="w-3 h-3" />
        <span>{score}% Match</span>
      </span>
    );
  }

  if (size === 'lg') {
    return (
      <div className={`p-4 rounded-2xl border ${colorStyles.bg} flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center font-bold text-lg text-slate-900">
            {score}%
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Skill Alignment</div>
            <div className="font-bold text-slate-900">{colorStyles.tierLabel}</div>
          </div>
        </div>
        <div className="w-24 bg-white/80 rounded-full h-2.5 overflow-hidden border border-slate-200">
          <div className={`h-full ${colorStyles.bar} rounded-full transition-all duration-500`} style={{ width: `${score}%` }} />
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border text-xs font-semibold ${colorStyles.bg}`}>
      <span className="font-bold">{score}% Match</span>
      {showLabel && <span className="text-slate-400 font-normal">|</span>}
      {showLabel && <span className="font-medium text-slate-600">{colorStyles.tierLabel}</span>}
    </div>
  );
};
