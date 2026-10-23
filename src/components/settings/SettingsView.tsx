import React, { useState } from 'react';
import { useQueue } from '../../context/QueueContext';
import {
  Settings,
  Clock,
  Volume2,
  Building2,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Save,
  Trash2,
  Moon,
  Sun,
  Palette,
} from 'lucide-react';
import { ConfirmationModal } from '../common/ConfirmationModal';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    resetDemoData,
    seedMorePatients,
    clearAllServed,
  } = useQueue();

  const isDark = settings.theme === 'dark';

  // Local draft settings
  const [hospitalName, setHospitalName] = useState(settings.hospitalName);
  const [departmentName, setDepartmentName] = useState(settings.departmentName);
  const [avgTime, setAvgTime] = useState(settings.avgConsultationMinutes);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundAnnouncement);
  const [activeCounters, setActiveCounters] = useState(settings.activeCounters);
  const [theme, setTheme] = useState<'dark' | 'light'>(settings.theme);

  // Modals
  const [showResetModal, setShowResetModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      hospitalName,
      departmentName,
      avgConsultationMinutes: Number(avgTime),
      soundAnnouncement: soundEnabled,
      activeCounters: Number(activeCounters),
      theme,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Configuration Form Card with Lunetra Glass Surface */}
      <div
        className={`rounded-3xl border overflow-hidden transition-all shadow-xl ${
          isDark
            ? 'bg-[#0B1526]/85 border-white/10 text-white'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        <div
          className={`p-6 sm:p-8 border-b ${
            isDark ? 'border-white/10 bg-white/[0.02]' : 'border-slate-100 bg-slate-50/50'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf]" />
            <span className="text-xs font-mono uppercase tracking-wider text-teal-400 font-semibold">
              System Control
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-teal-400" />
            Queue & Station Configuration
          </h2>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Adjust clinical wait time algorithms, counter throughput, and aesthetic theme preferences.
          </p>
        </div>

        <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6">
          <div className="space-y-6">
            {/* Visual Theme Mode */}
            <div
              className={`p-5 rounded-2xl border ${
                isDark ? 'bg-white/[0.03] border-white/10' : 'bg-[#F4F7FB] border-slate-200'
              }`}
            >
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-400 font-mono flex items-center gap-2">
                <Palette className="w-4 h-4 text-teal-400" />
                Interface Visual Theme
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    theme === 'dark'
                      ? 'bg-teal-500/15 border-teal-400 text-white shadow-[0_0_15px_rgba(45,212,191,0.2)]'
                      : isDark
                      ? 'bg-black/30 border-white/10 text-slate-400 hover:border-white/20'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-teal-400">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">Lunetra Cyber Dark (Active)</div>
                    <div className="text-[11px] text-slate-400">Deep obsidian navy with luminous neon accents</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    theme === 'light'
                      ? 'bg-teal-500/15 border-teal-400 text-white shadow-[0_0_15px_rgba(45,212,191,0.2)]'
                      : isDark
                      ? 'bg-black/30 border-white/10 text-slate-400 hover:border-white/20'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center text-amber-500">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">Crisp Clinical Light</div>
                    <div className="text-[11px] text-slate-400">High-contrast clinical daylight theme</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Hospital & Department Branding */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="hosp-name"
                  className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-400 font-mono"
                >
                  Hospital / Health Center Name
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="hosp-name"
                    type="text"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-none ${
                      isDark
                        ? 'bg-black/30 border-white/10 text-white focus:border-teal-400 focus:ring-1 focus:ring-teal-400/40'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-teal-600'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="dept-name"
                  className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-400 font-mono"
                >
                  Clinic / Wing Name
                </label>
                <input
                  id="dept-name"
                  type="text"
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none ${
                    isDark
                      ? 'bg-black/30 border-white/10 text-white focus:border-teal-400 focus:ring-1 focus:ring-teal-400/40'
                      : 'bg-white border-slate-300 text-slate-900 focus:border-teal-600'
                  }`}
                />
              </div>
            </div>

            {/* Average Consultation Time Slider */}
            <div
              className={`p-5 rounded-2xl border ${
                isDark ? 'bg-white/[0.03] border-white/10' : 'bg-[#F4F7FB] border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="avg-time"
                  className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2"
                >
                  <Clock className="w-4 h-4 text-teal-400" />
                  Average Consultation Time per Patient
                </label>
                <span className="font-mono text-lg font-black text-teal-300 tabular-nums">
                  {avgTime} minutes
                </span>
              </div>
              <input
                id="avg-time"
                type="range"
                min="5"
                max="45"
                step="1"
                value={avgTime}
                onChange={(e) => setAvgTime(Number(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
                <span>5m (Express)</span>
                <span>15m (Standard)</span>
                <span>30m</span>
                <span>45m (Comprehensive)</span>
              </div>
            </div>

            {/* Active Counters / Consultation Rooms */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="active-counters"
                  className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-400 font-mono"
                >
                  Active Consultation Counters
                </label>
                <select
                  id="active-counters"
                  value={activeCounters}
                  onChange={(e) => setActiveCounters(Number(e.target.value))}
                  className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none ${
                    isDark
                      ? 'bg-[#0E1A2D] border-white/10 text-white'
                      : 'bg-white border-slate-300 text-slate-800'
                  }`}
                >
                  <option value={1}>1 Counter (Single Doctor)</option>
                  <option value={2}>2 Counters</option>
                  <option value={3}>3 Counters (Standard Setup)</option>
                  <option value={4}>4 Counters</option>
                  <option value={5}>5 Counters (Full Wing)</option>
                </select>
              </div>

              {/* Sound & Audio Announcement Toggle */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-400 font-mono">
                  Audio & PA System
                </label>
                <label
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    isDark
                      ? 'bg-black/30 border-white/10 hover:border-white/20'
                      : 'bg-white border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={(e) => setSoundEnabled(e.target.checked)}
                    className="w-4 h-4 text-teal-400 rounded accent-teal-400 cursor-pointer"
                  />
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <Volume2 className="w-4 h-4 text-teal-400" />
                    <span>Play Chime & Voice Paging Announcements</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div
            className={`pt-6 border-t flex justify-end ${
              isDark ? 'border-white/10' : 'border-slate-100'
            }`}
          >
            <button
              type="submit"
              className={`px-7 py-3 text-xs sm:text-sm font-semibold rounded-full shadow-lg transition-all flex items-center gap-2 ${
                isDark
                  ? 'bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 hover:brightness-110 shadow-[0_0_20px_rgba(45,212,191,0.3)]'
                  : 'bg-teal-600 hover:bg-teal-700 text-white'
              }`}
            >
              <Save className="w-4 h-4" />
              Save Configuration
            </button>
          </div>
        </form>
      </div>

      {/* Demo Controls & Data Management */}
      <div
        className={`rounded-3xl border p-6 sm:p-8 space-y-4 transition-all shadow-xl ${
          isDark
            ? 'bg-[#0B1526]/85 border-white/10 text-white'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        <h3 className="text-sm font-bold flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-teal-400" />
          Demo Simulation Controls
        </h3>
        <p className="text-xs text-slate-400">
          Populate synthetic queue traffic or reset back to initial clinical demo state.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Add Sample Patient */}
          <button
            type="button"
            onClick={seedMorePatients}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-full border transition-all ${
              isDark
                ? 'bg-teal-400/15 border-teal-400/30 text-teal-300 hover:bg-teal-400/25'
                : 'text-teal-800 bg-teal-50 border-teal-200 hover:bg-teal-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-teal-400" />
            Seed Sample Patient
          </button>

          {/* Archive Served */}
          <button
            type="button"
            onClick={() => setShowClearModal(true)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium rounded-full border transition-all ${
              isDark
                ? 'bg-white/[0.05] border-white/10 text-slate-300 hover:bg-white/10'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Trash2 className="w-4 h-4 text-slate-400" />
            Archive Completed Records
          </button>

          {/* Reset Demo Data */}
          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 transition-all"
          >
            <RotateCcw className="w-4 h-4 text-rose-400" />
            Reset Demo Data
          </button>
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showResetModal}
        title="Reset All Demo Queue Data?"
        message="This action will restore the initial 3 sample patients (Eleanor Vance, Marcus Chen, Sophia Rodriguez) and reset all queue statistics."
        confirmLabel="Reset Demo"
        cancelLabel="Keep Current Data"
        isDestructive={true}
        onConfirm={() => {
          resetDemoData();
          setShowResetModal(false);
        }}
        onCancel={() => setShowResetModal(false)}
      />

      <ConfirmationModal
        isOpen={showClearModal}
        title="Archive Completed Records?"
        message="This will clear all served and completed patient tokens from the active queue list."
        confirmLabel="Archive"
        cancelLabel="Cancel"
        isDestructive={false}
        onConfirm={() => {
          clearAllServed();
          setShowClearModal(false);
        }}
        onCancel={() => setShowClearModal(false)}
      />
    </div>
  );
};
