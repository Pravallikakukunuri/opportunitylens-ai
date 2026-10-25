import React, { useEffect, useRef } from 'react';
import type { AppNotification } from '../../types';
import {
  ShieldAlert,
  AlertTriangle,
  Briefcase,
  BrainCircuit,
  CheckCheck,
  X,
  BellOff,
  ChevronRight,
} from 'lucide-react';

interface NotificationPanelProps {
  notifications: AppNotification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onSelectNotification: (notification: AppNotification) => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onSelectNotification,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape or click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'scam_alert':
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      case 'due_diligence':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'pipeline_update':
        return <Briefcase className="w-4 h-4 text-indigo-600" />;
      case 'skill_gap':
        return <BrainCircuit className="w-4 h-4 text-violet-600" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200/90 z-50 overflow-hidden flex flex-col max-h-[30rem] animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Security & Application Alerts
          </h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
              {unreadCount} unread
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 p-1.5 rounded-lg hover:bg-white cursor-pointer transition-colors"
              title="Mark all alerts as read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 cursor-pointer"
            title="Close notifications"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="overflow-y-auto divide-y divide-slate-100 flex-1">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2 text-slate-400">
              <BellOff className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-slate-700">All caught up!</p>
            <p className="text-[11px] text-slate-400 mt-1">
              No scam flags or unverified due-diligence items in your pipeline.
            </p>
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onMarkAsRead(item.id);
                onSelectNotification(item);
              }}
              className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 hover:bg-slate-50 ${
                !item.read ? 'bg-indigo-50/20' : 'bg-white'
              }`}
            >
              <div
                className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                  item.severity === 'high'
                    ? 'bg-rose-50 border border-rose-200'
                    : item.severity === 'medium'
                    ? 'bg-amber-50 border border-amber-200'
                    : 'bg-indigo-50 border border-indigo-200'
                }`}
              >
                {getIcon(item.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {item.title}
                  </span>
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                  {item.message}
                </p>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-[10px] font-medium text-slate-400">
                    {item.severity === 'high'
                      ? '⚠️ Critical Warning'
                      : item.severity === 'medium'
                      ? '📋 Due Diligence'
                      : 'ℹ️ Application Notice'}
                  </span>
                  <span className="text-[10px] text-indigo-600 font-semibold flex items-center gap-0.5">
                    <span>View details</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-slate-50/80 border-t border-slate-100 text-center">
        <p className="text-[10px] text-slate-400">
          Derived from live saved opportunities & diligence checklists
        </p>
      </div>
    </div>
  );
};
