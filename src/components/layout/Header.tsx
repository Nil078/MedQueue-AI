import React, { useState, useEffect, useRef } from 'react';
import { useQueue } from '../../context/QueueContext';
import {
  Bell,
  Menu,
  UserPlus,
  Calendar,
  Check,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronDown,
  Clock,
  ShieldCheck,
  Moon,
  Sun,
  Activity,
  ArrowRight,
} from 'lucide-react';

interface HeaderProps {
  onOpenMobile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobile }) => {
  const {
    currentView,
    setCurrentView,
    notifications,
    markAllNotificationsRead,
    settings,
    updateSettings,
    stats,
  } = useQueue();

  const isDark = settings.theme === 'dark';

  const [currentDateTime, setCurrentDateTime] = useState({
    date: '',
    time: '',
  });

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Live real-time clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDateTime({
        date: now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        time: now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      });
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const viewTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Queue Overview',
      subtitle: `${settings.hospitalName} · ${settings.departmentName}`,
    },
    register: {
      title: 'Patient Registration',
      subtitle: 'Intake and new outpatient token assignment',
    },
    'live-queue': {
      title: 'Live Outpatient Queue',
      subtitle: 'Real-time patient flow, room calls, and status tracking',
    },
    'waiting-room': {
      title: 'Waiting Room TV Display',
      subtitle: 'Public terminal display for outpatient waiting hall',
    },
    settings: {
      title: 'Queue Configuration',
      subtitle: 'Service timing parameters, active counters, and system controls',
    },
  };

  const currentInfo = viewTitles[currentView] || viewTitles.dashboard;
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header
      className={`h-16 px-4 sm:px-6 sticky top-0 z-30 transition-colors backdrop-blur-xl border-b ${
        isDark
          ? 'bg-[#081220]/85 border-white/10 text-white'
          : 'bg-white/95 border-slate-200 text-slate-800 shadow-xs'
      } flex items-center justify-between`}
    >
      {/* Left zone: Mobile toggle & contextual breadcrumb */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <button
          onClick={onOpenMobile}
          className={`lg:hidden p-2 rounded-lg transition-colors ${
            isDark ? 'text-slate-300 hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100'
          }`}
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold tracking-tight truncate leading-tight">
              {currentInfo.title}
            </h1>
            {isDark && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[10px] text-teal-300 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_#2dd4bf]" />
                Station 02
              </span>
            )}
          </div>
          <p
            className={`text-xs truncate hidden sm:block ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right zone: Date/Time, Quick Register CTA, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
        {/* Real-time Clock */}
        <div
          className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-colors border ${
            isDark
              ? 'bg-white/[0.05] border-white/10 text-slate-300'
              : 'bg-[#F4F7FB] border-slate-200/80 text-slate-700'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-teal-400 shrink-0" />
          <span className="font-medium">{currentDateTime.date}</span>
          <span className={isDark ? 'text-slate-600' : 'text-slate-300'}>|</span>
          <Clock className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-teal-400' : 'text-slate-400'}`} />
          <span className="font-mono tabular-nums font-semibold">
            {currentDateTime.time}
          </span>
        </div>

        {/* Theme Toggle (Lunetra Dark vs Light) */}
        <button
          onClick={() => updateSettings({ theme: isDark ? 'light' : 'dark' })}
          className={`p-2 rounded-full border transition-all ${
            isDark
              ? 'bg-white/[0.06] border-white/10 text-teal-300 hover:bg-white/10 hover:border-teal-400/40'
              : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
          }`}
          title={isDark ? 'Switch to Light Clinical Theme' : 'Switch to Lunetra Dark Cyber Theme'}
          aria-label="Toggle Theme"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Quick Register CTA Button (Lunetra Arrow Pill Style) */}
        {currentView !== 'register' && (
          <button
            onClick={() => setCurrentView('register')}
            className={`flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold rounded-full shadow-xs transition-all group ${
              isDark
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 hover:brightness-110 shadow-[0_0_15px_rgba(45,212,191,0.25)]'
                : 'bg-teal-600 hover:bg-teal-700 text-white'
            }`}
          >
            <UserPlus className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">New Intake</span>
            <span className="sm:hidden">Intake</span>
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-0.5 ${
                isDark ? 'bg-slate-950/20 text-slate-950' : 'bg-white/20 text-white'
              }`}
            >
              <ArrowRight className="w-2.5 h-2.5" />
            </div>
          </button>
        )}

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-full border transition-colors ${
              isDark
                ? 'bg-white/[0.06] border-white/10 text-slate-300 hover:bg-white/10'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent'
            }`}
            aria-label={`View notifications (${unreadCount} unread)`}
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center tabular-nums shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100 border ${
                isDark
                  ? 'bg-[#0D192E] border-white/10 text-white shadow-[0_12px_40px_rgba(0,0,0,0.8)]'
                  : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <div
                className={`flex items-center justify-between px-4 py-2.5 border-b ${
                  isDark ? 'border-white/10' : 'border-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">Queue Alerts</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-[11px] font-medium bg-teal-500/20 text-teal-300 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No active notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 text-xs flex gap-3 transition-colors ${
                        notif.read
                          ? isDark
                            ? 'bg-transparent opacity-60'
                            : 'bg-white opacity-80'
                          : isDark
                          ? 'bg-teal-950/30'
                          : 'bg-teal-50/30'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {notif.type === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : notif.type === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Info className="w-4 h-4 text-teal-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="font-semibold truncate">{notif.title}</p>
                          <span
                            className={`text-[10px] whitespace-nowrap ${
                              isDark ? 'text-slate-400' : 'text-slate-400'
                            }`}
                          >
                            {notif.time}
                          </span>
                        </div>
                        <p
                          className={`mt-0.5 line-clamp-2 ${
                            isDark ? 'text-slate-300' : 'text-slate-600'
                          }`}
                        >
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Receptionist Profile Badge with Avatar */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className={`flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1 rounded-full border transition-all ${
              isDark
                ? 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08] text-white'
                : 'hover:bg-slate-100 border-transparent text-slate-900'
            }`}
            aria-label="User Profile menu"
          >
            <div className="relative">
              <img
                src="/src/assets/images/receptionist_avatar_1792742271425.jpg"
                alt="Sarah Jenkins, RN"
                className="w-8 h-8 rounded-full object-cover border border-teal-400/80 shadow-xs"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#081220] shadow-[0_0_6px_#34d399]" />
            </div>

            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold leading-tight truncate">
                Sarah Jenkins, RN
              </span>
              <span className="text-[10px] text-teal-400 font-medium">
                Counter 02 Active
              </span>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div
              className={`absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl py-3 px-4 z-50 animate-in fade-in zoom-in-95 duration-100 text-xs border ${
                isDark
                  ? 'bg-[#0D192E] border-white/10 text-white shadow-[0_12px_40px_rgba(0,0,0,0.8)]'
                  : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <div
                className={`flex items-center gap-3 pb-3 border-b ${
                  isDark ? 'border-white/10' : 'border-slate-100'
                }`}
              >
                <img
                  src="/src/assets/images/receptionist_avatar_1792742271425.jpg"
                  alt="Sarah Jenkins, RN"
                  className="w-10 h-10 rounded-full object-cover border border-teal-400/40"
                />
                <div>
                  <h4 className="font-bold text-sm">Sarah Jenkins, RN</h4>
                  <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                    Outpatient Intake Officer
                  </p>
                  <p className="text-teal-400 text-[11px] font-mono">ID: RECEPT-02</p>
                </div>
              </div>

              <div className={`py-2.5 space-y-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                <div className="flex items-center justify-between py-1">
                  <span>Current Shift:</span>
                  <span className="font-semibold text-teal-300">08:00 - 16:00</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span>Assigned Station:</span>
                  <span className="font-semibold text-teal-400">Counter 2 (Triage)</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span>Security Role:</span>
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" /> Certified Staff
                  </span>
                </div>
              </div>

              <div className={`pt-2 border-t ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                <button
                  onClick={() => {
                    setCurrentView('settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-center py-1.5 text-teal-400 hover:text-teal-300 font-semibold hover:bg-white/5 rounded-lg transition-colors"
                >
                  Configure Station Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
