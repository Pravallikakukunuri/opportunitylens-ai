import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, PlusCircle, Bell, UserCheck, Menu } from 'lucide-react';
import type { UserProfile, Opportunity, AppNotification } from '../../types';
import { HeaderSearch } from './HeaderSearch';
import { NotificationPanel } from './NotificationPanel';
import {
  generateNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../../services/notificationService';

interface NavbarProps {
  profile: UserProfile;
  opportunities: Opportunity[];
  onOpenMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  opportunities = [],
  onOpenMobileMenu,
}) => {
  const navigate = useNavigate();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notificationUpdateTick, setNotificationUpdateTick] = useState(0);

  // Derive notifications from current opportunities and read state
  const notifications = React.useMemo(() => {
    void notificationUpdateTick;
    return generateNotifications(opportunities || []);
  }, [opportunities, notificationUpdateTick]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    markNotificationAsRead(id);
    setNotificationUpdateTick((t) => t + 1);
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead(notifications);
    setNotificationUpdateTick((t) => t + 1);
  };

  const handleSelectNotification = (item: AppNotification) => {
    setIsNotificationsOpen(false);
    if (item.opportunityId) {
      navigate('/saved', { state: { selectedOppId: item.opportunityId } });
    } else {
      navigate('/saved');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3 transition-all">
      <div className="flex items-center justify-between gap-3 sm:gap-4 max-w-7xl mx-auto">
        {/* Left: Mobile Hamburger & Search */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-lg">
          {onOpenMobileMenu && (
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden cursor-pointer shrink-0 transition-colors"
              title="Open Navigation Menu"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="flex-1">
            <HeaderSearch opportunities={opportunities} profile={profile} />
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Analyze Button */}
          <Link
            to="/analyze"
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-all hover:shadow-indigo-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Analyze New Job</span>
          </Link>

          {/* Engine Indicator Pill */}
          <Link
            to="/settings"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200/70 rounded-xl text-xs font-semibold text-indigo-700 transition-colors cursor-pointer"
            title="Inspect AI Engine & Model Transparency"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span>AI Shield Engine</span>
          </Link>

          {/* Notification Bell with Dropdown Panel */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNotificationsOpen((prev) => !prev)}
              className={`relative p-2 rounded-xl transition-colors cursor-pointer ${
                isNotificationsOpen
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Security & Pipeline Alerts"
              aria-label="Notifications"
              aria-expanded={isNotificationsOpen}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-4 h-4 px-1 bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white animate-in zoom-in-50">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <NotificationPanel
              notifications={notifications}
              isOpen={isNotificationsOpen}
              onClose={() => setIsNotificationsOpen(false)}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
              onSelectNotification={handleSelectNotification}
            />
          </div>

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          {/* Student Profile Quick Button */}
          <Link
            to="/profile"
            className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl hover:bg-slate-100 transition-colors group"
            title="My Skill Profile"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : 'P'}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                {profile?.name || 'Pravallika'}
              </div>
              <div className="text-[10px] text-slate-500 flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-emerald-600 inline" />
                <span>{profile?.headline || 'CSE Student · Class of 2028'}</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

