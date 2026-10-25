import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  SearchCode,
  BookmarkCheck,
  UserCheck,
  Settings,
  ShieldCheck,
  AlertOctagon,
  Sparkles,
  X,
} from 'lucide-react';

interface SidebarProps {
  savedCount: number;
  highRiskCount: number;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ savedCount, highRiskCount, onClose }) => {
  const navItems = [
    {
      label: 'Dashboard',
      to: '/',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      label: 'Analyze Opportunity',
      to: '/analyze',
      icon: SearchCode,
      badge: 'New',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30',
    },
    {
      label: 'Saved Opportunities',
      to: '/saved',
      icon: BookmarkCheck,
      badge: savedCount > 0 ? `${savedCount}` : null,
      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
    },
    {
      label: 'My Skill Profile',
      to: '/profile',
      icon: UserCheck,
      badge: null,
    },
    {
      label: 'Settings',
      to: '/settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 bg-[#0a1128] text-slate-200 border-r border-slate-800/80 flex flex-col shrink-0 h-full overflow-y-auto select-none [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-800 [&::-webkit-scrollbar-track]:bg-transparent">
      {/* Brand Header */}
      <div className="px-4.5 py-3.5 border-b border-slate-800/80 flex items-center justify-between shrink-0">
        <NavLink to="/" onClick={onClose} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center text-white shrink-0">
            <ShieldCheck className="w-5 h-5 transform group-hover:scale-105 transition-transform" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white font-['Plus_Jakarta_Sans']">
                OpportunityLens
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium leading-tight">Scam Shield & Skill Gap</p>
          </div>
        </NavLink>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden cursor-pointer"
            title="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="px-3 py-3 flex-1 space-y-1">
        <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-indigo-600/90 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                    item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}

        {/* Quick Insights pill */}
        {highRiskCount > 0 && (
          <div className="pt-2 px-1">
            <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/40 flex items-start gap-2">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-[11px] font-bold text-rose-200">
                  {highRiskCount} Flagged Postings
                </div>
                <div className="text-[10px] text-rose-300/80 leading-tight">
                  High-risk indicators recorded in your pipeline.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Safety Notice Footer Card */}
      <div className="p-3 m-3 rounded-xl bg-slate-900/90 border border-slate-800/90 text-slate-300 shrink-0">
        <div className="flex items-center gap-2 mb-1.5 text-indigo-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-[11px] font-bold">Fresher Safety Rule #1</span>
        </div>
        <p className="text-[10.5px] text-slate-400 leading-snug mb-2">
          Legitimate employers will <strong className="text-white">never</strong> ask for money, laptop deposits, or registration fees.
        </p>
        <div className="text-[9.5px] text-indigo-400/90 font-mono flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>AI & Deterministic Engine Active</span>
        </div>
      </div>
    </aside>
  );
};
