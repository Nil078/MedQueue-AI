import React from 'react';
import { useQueue, ViewType } from '../../context/QueueContext';
import {
  LayoutDashboard,
  UserPlus,
  Users,
  Tv,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
  Clock,
  Sparkles,
  Layers,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const { currentView, setCurrentView, stats, settings } = useQueue();
  const isDark = settings.theme === 'dark';

  const navItems: { id: ViewType; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'register',
      label: 'Patient Registration',
      icon: <UserPlus className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'live-queue',
      label: 'Live Queue',
      icon: <Users className="w-4 h-4 shrink-0" />,
      badge: stats.waitingCount,
    },
    {
      id: 'waiting-room',
      label: 'Waiting Room TV',
      icon: <Tv className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4 shrink-0" />,
    },
  ];

  const handleNavClick = (view: ViewType) => {
    setCurrentView(view);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/80 lg:hidden backdrop-blur-sm transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Main sidebar container with Lunetra Obsidian Navy Styling */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 flex flex-col justify-between transition-all duration-300 ease-in-out border-r ${
          isDark
            ? 'bg-[#060D19] border-white/10 text-slate-100'
            : 'bg-[#142D4E] border-[#1B3B66] text-slate-100'
        } ${mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'} ${
          collapsed ? 'lg:w-20' : 'lg:w-64'
        }`}
      >
        {/* Top brand header */}
        <div>
          <div
            className={`h-16 flex items-center justify-between px-4 border-b ${
              isDark ? 'border-white/10' : 'border-[#1f3f6b]'
            }`}
          >
            <div
              onClick={() => handleNavClick('dashboard')}
              className="flex items-center gap-3 cursor-pointer select-none overflow-hidden group"
            >
              {/* Lunetra-style geometric glowing emblem */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-slate-950 shadow-[0_0_15px_rgba(45,212,191,0.35)] shrink-0 group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5 stroke-[2.5]" />
              </div>
              {!collapsed && (
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-base tracking-tight text-white leading-tight">
                      MedQueue
                    </span>
                    <span className="text-teal-400 font-semibold text-xs px-1.5 py-0.2 rounded-full bg-teal-400/10 border border-teal-400/30">
                      Tech
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 tracking-wider truncate uppercase font-medium">
                    Clinical Queue OS
                  </span>
                </div>
              )}
            </div>

            {/* Desktop collapse toggle */}
            <button
              onClick={onToggleCollapse}
              className={`hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors ${
                isDark ? 'hover:bg-white/10' : 'hover:bg-[#1E3E69]'
              }`}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links with Lunetra Pill Aesthetics */}
          <nav className="p-3 space-y-1.5" aria-label="Sidebar Navigation">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-full text-xs font-medium transition-all relative group ${
                    isActive
                      ? isDark
                        ? 'bg-white/[0.1] text-white border border-teal-400/40 shadow-[0_0_15px_rgba(45,212,191,0.15)] font-semibold'
                        : 'bg-teal-600 text-white shadow-xs font-semibold'
                      : isDark
                      ? 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                      : 'text-slate-300 hover:bg-[#1C3B64] hover:text-white'
                  } ${collapsed ? 'justify-center' : 'justify-between'}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Glowing active dot like in the reference image */}
                    {isActive && isDark && (
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf] shrink-0" />
                    )}
                    <span
                      className={
                        isActive
                          ? 'text-teal-400'
                          : isDark
                          ? 'text-slate-500 group-hover:text-slate-300'
                          : 'text-slate-400 group-hover:text-teal-300'
                      }
                    >
                      {item.icon}
                    </span>
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {/* Badge */}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`tabular-nums text-[11px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                        isActive
                          ? isDark
                            ? 'bg-teal-400/20 text-teal-300 border border-teal-400/30'
                            : 'bg-white/20 text-white'
                          : isDark
                          ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                          : 'bg-amber-400 text-slate-900 font-bold'
                      } ${collapsed ? 'absolute -top-1 -right-1 text-[10px] px-1.5 py-0' : ''}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Queue Status Card */}
        <div className={`p-3 border-t ${isDark ? 'border-white/10' : 'border-[#1f3f6b]'}`}>
          {!collapsed ? (
            <div
              className={`p-3 rounded-2xl text-xs border ${
                isDark
                  ? 'bg-white/[0.03] border-white/10'
                  : 'bg-[#0F233D] border-[#1d3d67]'
              }`}
            >
              <div className="flex items-center justify-between text-slate-300 mb-2">
                <span className="font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                  Live Station
                </span>
                <span className="text-[10px] text-teal-400 font-mono">Counter 02</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-400 pt-1">
                <div
                  className={`p-2 rounded-xl border ${
                    isDark ? 'bg-black/30 border-white/5' : 'bg-[#142D4E] border-[#224472]'
                  }`}
                >
                  <div className="text-[10px] text-slate-400">Waiting</div>
                  <div className="text-sm font-bold text-amber-300 tabular-nums">
                    {stats.waitingCount} <span className="text-[10px] font-normal text-slate-400">pts</span>
                  </div>
                </div>
                <div
                  className={`p-2 rounded-xl border ${
                    isDark ? 'bg-black/30 border-white/5' : 'bg-[#142D4E] border-[#224472]'
                  }`}
                >
                  <div className="text-[10px] text-slate-400">Avg Wait</div>
                  <div className="text-sm font-bold text-teal-300 tabular-nums">
                    {stats.avgWaitTime} <span className="text-[10px] font-normal text-slate-400">min</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`flex flex-col items-center justify-center p-2 rounded-xl text-[11px] font-bold tabular-nums border ${
                isDark ? 'bg-white/[0.04] border-white/10 text-teal-400' : 'bg-[#0F233D] text-teal-400'
              }`}
            >
              <span>{stats.waitingCount}</span>
              <span className="text-[9px] text-slate-400 font-normal">wait</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
