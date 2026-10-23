import React, { useState } from 'react';
import { QueueProvider, useQueue } from './context/QueueContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/common/ToastContainer';
import { DashboardView } from './components/dashboard/DashboardView';
import { RegisterPatientView } from './components/registration/RegisterPatientView';
import { LiveQueueView } from './components/queue/LiveQueueView';
import { WaitingRoomView } from './components/waiting-room/WaitingRoomView';
import { SettingsView } from './components/settings/SettingsView';
import { ShieldCheck } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentView, settings } = useQueue();
  const isDark = settings.theme === 'dark';
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors antialiased ${
        isDark
          ? 'bg-[#060D19] text-slate-100 selection:bg-teal-500/30 selection:text-teal-200'
          : 'bg-[#F4F7FB] text-slate-800 selection:bg-teal-500/20 selection:text-teal-900'
      }`}
    >
      <div className="flex flex-1 min-h-screen overflow-hidden relative">
        {/* Ambient background glow for Lunetra theme */}
        {isDark && (
          <div className="fixed inset-0 bg-radial-glow pointer-events-none z-0" />
        )}

        {/* Left Sidebar */}
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative z-10">
          {/* Header */}
          <Header onOpenMobile={() => setMobileOpen(true)} />

          {/* Dynamic Page Views */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {currentView === 'dashboard' && <DashboardView />}
            {currentView === 'register' && <RegisterPatientView />}
            {currentView === 'live-queue' && <LiveQueueView />}
            {currentView === 'waiting-room' && <WaitingRoomView />}
            {currentView === 'settings' && <SettingsView />}
          </main>

          {/* Clinical Management Footer */}
          <footer
            className={`px-6 py-4 border-t text-xs flex flex-col sm:flex-row items-center justify-between gap-2 mt-auto transition-colors ${
              isDark
                ? 'bg-[#060D19]/90 border-white/10 text-slate-400'
                : 'bg-white border-slate-200/80 text-slate-500'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white">MedQueue</span>
              <span className="text-teal-400 font-mono text-[11px] font-semibold">TECH</span>
              <span className={isDark ? 'text-slate-600' : 'text-slate-300'}>·</span>
              <span>Outpatient Orchestration Engine</span>
              <span className={`hidden sm:inline ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>
                |
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-teal-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> HIPAA Certified Architecture
              </span>
            </div>
            <div className="font-mono text-[11px] tabular-nums text-slate-400">
              Station ID: RECEPT-02 · Engine v2.4 Active
            </div>
          </footer>
        </div>
      </div>

      {/* Global Interactive Toast Feedback */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <QueueProvider>
      <AppContent />
    </QueueProvider>
  );
}
