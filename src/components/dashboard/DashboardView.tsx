import React, { useState, useEffect } from 'react';
import { useQueue } from '../../context/QueueContext';
import {
  Users,
  Clock,
  UserCheck,
  CheckCircle,
  Volume2,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Phone,
  Tag,
  Stethoscope,
  Activity,
  ShieldCheck,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { DEPARTMENTS } from '../../data/mockData';

export const DashboardView: React.FC = () => {
  const {
    patients,
    stats,
    setCurrentView,
    callPatient,
    markServed,
    seedMorePatients,
    settings,
  } = useQueue();

  const isDark = settings.theme === 'dark';

  // Find currently serving patient(s)
  const currentlyServingList = patients.filter((p) => p.status === 'Serving');
  const primaryServing = currentlyServingList[0] || null;

  // Upcoming waiting queue
  const waitingPatients = patients.filter((p) => p.status === 'Waiting');

  // Recent activity / registrations
  const recentRegistrations = [...patients]
    .sort((a, b) => b.registeredAtTimestamp - a.registeredAtTimestamp)
    .slice(0, 5);

  // Live timer for currently serving consultation
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  useEffect(() => {
    if (!primaryServing || !primaryServing.servingStartTime) {
      setElapsedSeconds(0);
      return;
    }

    const updateElapsed = () => {
      const diff = Math.max(
        0,
        Math.floor((Date.now() - (primaryServing.servingStartTime || Date.now())) / 1000)
      );
      setElapsedSeconds(diff);
    };

    updateElapsed();
    const timer = setInterval(updateElapsed, 1000);
    return () => clearInterval(timer);
  }, [primaryServing]);

  const formatElapsed = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* ─── LUNETRA-STYLE HERO SHOWCASE BANNER ─── */}
      <div
        className={`relative rounded-3xl overflow-hidden p-6 sm:p-10 border transition-all ${
          isDark
            ? 'bg-[#091322] border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        {/* Ambient Radial Glow & Crosshair Grid */}
        {isDark && (
          <>
            <div className="absolute inset-0 bg-tech-grid opacity-60 pointer-events-none" />
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 right-10 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
            {/* Technical corner coordinate crosshairs */}
            <span className="absolute top-4 left-4 font-mono text-[10px] text-teal-400/40 select-none">
              + 01_DISPATCH
            </span>
            <span className="absolute top-4 right-4 font-mono text-[10px] text-teal-400/40 select-none">
              + COUNTER_02
            </span>
          </>
        )}

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Content (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Pill badges with glowing dots */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border ${
                  isDark
                    ? 'bg-white/[0.06] border-white/10 text-teal-300'
                    : 'bg-teal-50 border-teal-200 text-teal-800'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf]" />
                MedQueue Engine Active
              </span>

              <span
                className={`hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border ${
                  isDark
                    ? 'bg-white/[0.04] border-white/10 text-slate-300'
                    : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                Secure Clinical System
              </span>

              <span className="text-xs font-mono text-slate-400 tabular-nums">
                | +15K Patients Managed
              </span>
            </div>

            {/* Stylized Lunetra Title (Bold + Light contrast) */}
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-widest text-teal-400 font-mono font-semibold">
                Clinical Workflow Architecture
              </div>
              <h2
                className={`text-3xl sm:text-5xl font-black tracking-tight leading-[1.1] ${
                  isDark ? 'text-white' : 'text-[#142D4E]'
                }`}
              >
                Intelligent Queue <br />
                <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-sky-400 bg-clip-text text-transparent font-medium">
                  for Modern Healthcare
                </span>
              </h2>
            </div>

            <p
              className={`text-sm sm:text-base max-w-xl leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Smart patient orchestration engineered to minimize wait times, streamline doctor-patient routing, and broadcast real-time audio announcements.
            </p>

            {/* Action Buttons (Lunetra Arrow Pill Style) */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setCurrentView('register')}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2.5 transition-all group shadow-lg ${
                  isDark
                    ? 'bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 hover:brightness-110 shadow-[0_0_25px_rgba(45,212,191,0.3)]'
                    : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-700/20'
                }`}
              >
                <span>Register Intake</span>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1 ${
                    isDark ? 'bg-slate-950/20 text-slate-950' : 'bg-white/20 text-white'
                  }`}
                >
                  <ArrowRight className="w-3 h-3 stroke-[3]" />
                </div>
              </button>

              <button
                onClick={() => setCurrentView('waiting-room')}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium border flex items-center gap-2 transition-all ${
                  isDark
                    ? 'bg-white/[0.06] border-white/15 text-slate-200 hover:bg-white/[0.12] hover:border-teal-400/40'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#38bdf8]" />
                <span>Launch TV Display</span>
              </button>
            </div>
          </div>

          {/* Right Hero Visual: 3D Angled Glass Cards (5 cols) */}
          <div className="lg:col-span-5 relative flex items-center justify-center py-6 sm:py-0">
            {/* Floating Angled Glass Cards like Lunetra top banner */}
            <div className="relative w-full max-w-sm h-64 sm:h-72 flex items-center justify-center">
              {/* Back Card (Layer 3) */}
              <div
                className={`absolute w-52 h-40 rounded-2xl p-4 border transition-transform -rotate-12 -translate-y-6 -translate-x-6 shadow-xl ${
                  isDark
                    ? 'bg-[#0E1B31]/70 border-white/10 backdrop-blur-md text-white'
                    : 'bg-slate-100 border-slate-300 text-slate-800'
                }`}
              >
                <div className="text-[10px] text-slate-400 font-mono">TOKEN MQ-104</div>
                <div className="text-xl font-mono font-bold mt-1">Arthur P.</div>
                <div className="text-xs text-teal-400 mt-2">Orthopedics · Est. 25m</div>
              </div>

              {/* Middle Card (Layer 2) */}
              <div
                className={`absolute w-56 h-44 rounded-2xl p-5 border transition-transform -rotate-6 -translate-y-2 translate-x-2 shadow-2xl ${
                  isDark
                    ? 'bg-[#112340]/80 border-teal-400/30 backdrop-blur-md text-white shadow-[0_0_30px_rgba(45,212,191,0.15)]'
                    : 'bg-slate-50 border-teal-300 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-amber-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    NEXT IN LINE
                  </span>
                  <span className="font-mono">MQ-103</span>
                </div>
                <div className="text-2xl font-bold font-mono mt-2">Sophia R.</div>
                <div className="text-xs text-slate-300 mt-1">Pediatrics · Routine Care</div>
                <div className="mt-3 inline-block px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-mono">
                  ~10 min wait
                </div>
              </div>

              {/* Front Floating Card (Layer 1 - Performance / Live Flow Card like in reference) */}
              <div
                className={`absolute w-60 h-44 rounded-2xl p-4 border transition-all rotate-3 translate-y-8 translate-x-8 shadow-2xl ${
                  isDark
                    ? 'bg-[#08152A]/90 border-teal-400/60 backdrop-blur-xl text-white shadow-[0_15px_40px_rgba(0,0,0,0.8)]'
                    : 'bg-white border-teal-400 text-slate-900 shadow-xl'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf]" />
                    Flow Velocity
                  </div>
                  <span className="text-[10px] font-mono text-teal-400">OPTIMAL</span>
                </div>

                {/* Glowing Waveform Sparkline like Panel 3 in image */}
                <div className="my-2 h-10 w-full flex items-center justify-center">
                  <svg className="w-full h-8 overflow-visible" viewBox="0 0 100 24" fill="none">
                    <path
                      d="M0 16 Q 20 4, 40 14 T 70 8 T 100 12"
                      stroke="#2DD4BF"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M0 16 Q 20 4, 40 14 T 70 8 T 100 12 L 100 24 L 0 24 Z"
                      fill="url(#sparkline-glow)"
                      opacity="0.3"
                    />
                    <defs>
                      <linearGradient id="sparkline-glow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2DD4BF" />
                        <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <div className="flex items-baseline justify-between pt-1 border-t border-white/10">
                  <span className="text-xl font-extrabold font-mono text-teal-300 tabular-nums">
                    98.4%
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">On-Time Index</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 4 KPI SUMMARY CARDS (Frosted Lunetra Panels) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Patients */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDark
              ? 'bg-[#0B1526]/80 border-white/10 hover:border-teal-400/40 shadow-lg text-white'
              : 'bg-white border-slate-200 text-slate-900 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Patients Today
            </span>
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-white/5 text-teal-400' : 'bg-slate-100 text-slate-700'
              }`}
            >
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-black font-mono tabular-nums tracking-tight">
              {stats.totalToday}
            </span>
            <span className="text-[11px] text-teal-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" /> Active Session
            </span>
          </div>
        </div>

        {/* Patients Waiting */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDark
              ? 'bg-[#0B1526]/80 border-white/10 hover:border-amber-400/40 shadow-lg text-white'
              : 'bg-white border-slate-200 text-slate-900 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Patients Waiting
            </span>
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-amber-400/10 text-amber-400' : 'bg-amber-50 text-amber-700'
              }`}
            >
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-black font-mono text-amber-400 tabular-nums tracking-tight">
              {stats.waitingCount}
            </span>
            <span className="text-[11px] text-amber-300 font-medium">
              ~{stats.avgWaitTime} min avg wait
            </span>
          </div>
        </div>

        {/* Currently Serving */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDark
              ? 'bg-[#0B1526]/80 border-white/10 hover:border-teal-400/40 shadow-lg text-white'
              : 'bg-white border-slate-200 text-slate-900 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Currently Serving
            </span>
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-teal-400/10 text-teal-400' : 'bg-teal-50 text-teal-700'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-black font-mono text-teal-400 tabular-nums tracking-tight">
              {stats.servingCount}
            </span>
            <span className="text-[11px] text-teal-300 font-medium">In consultation</span>
          </div>
        </div>

        {/* Completed Consultations */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDark
              ? 'bg-[#0B1526]/80 border-white/10 hover:border-emerald-400/40 shadow-lg text-white'
              : 'bg-white border-slate-200 text-slate-900 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Completed Visits
            </span>
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-emerald-400/10 text-emerald-400' : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-black font-mono text-emerald-400 tabular-nums tracking-tight">
              {stats.servedCount}
            </span>
            <span className="text-[11px] text-emerald-300 font-medium">Discharged</span>
          </div>
        </div>
      </div>

      {/* ─── MAIN GRID: CURRENTLY SERVING SPOTLIGHT & UPCOMING QUEUE ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Currently Serving Spotlight (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div
            className={`rounded-2xl border p-6 transition-all ${
              isDark
                ? 'bg-[#0B1526]/80 border-white/10 text-white shadow-xl'
                : 'bg-white border-slate-200 text-slate-900 shadow-xs'
            }`}
          >
            <div
              className={`flex items-center justify-between pb-4 border-b ${
                isDark ? 'border-white/10' : 'border-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf] animate-pulse" />
                <h3 className="text-base font-bold tracking-tight">Active Consultation</h3>
              </div>
              <span className="text-xs font-mono text-teal-400 font-medium">
                {primaryServing ? primaryServing.counterOrRoom : 'All stations idle'}
              </span>
            </div>

            {primaryServing ? (
              <div className="mt-5 space-y-5">
                {/* Active Patient Card */}
                <div
                  className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                    isDark
                      ? 'bg-white/[0.03] border-teal-500/30'
                      : 'bg-[#F4F7FB] border-slate-200/70'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="px-4 py-2.5 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-slate-950 font-mono font-black text-2xl tabular-nums shadow-[0_0_15px_rgba(45,212,191,0.3)]">
                      {primaryServing.tokenNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xl font-extrabold leading-tight">
                          {primaryServing.name}
                        </h4>
                        <span className="text-xs text-slate-400">
                          {primaryServing.age} yrs · {primaryServing.gender}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs">
                        <span className="font-semibold text-teal-400">
                          {primaryServing.department}
                        </span>
                        <span className="text-slate-600">·</span>
                        <span className="text-slate-400">
                          Reg {primaryServing.registrationTime}
                        </span>
                        {primaryServing.priority !== 'Normal' && (
                          <>
                            <span className="text-slate-600">·</span>
                            <span className="text-rose-400 font-semibold">
                              {primaryServing.priority}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Consultation Duration Timer */}
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">
                      Elapsed Time
                    </div>
                    <div className="font-mono text-2xl sm:text-3xl font-black text-teal-300 tabular-nums">
                      {formatElapsed(elapsedSeconds)}
                    </div>
                  </div>
                </div>

                {/* Chief Complaint / Notes */}
                {primaryServing.notes && (
                  <div
                    className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                      isDark
                        ? 'bg-amber-400/[0.06] border-amber-400/20 text-amber-200'
                        : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}
                  >
                    <Tag className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">Intake Notes:</span> {primaryServing.notes}
                    </div>
                  </div>
                )}

                {/* Action Buttons for Active Patient */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => markServed(primaryServing.id)}
                    className={`flex-1 min-w-[170px] flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-full shadow-lg transition-all ${
                      isDark
                        ? 'bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 hover:brightness-110 shadow-[0_0_20px_rgba(45,212,191,0.25)]'
                        : 'bg-teal-600 hover:bg-teal-700 text-white'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Complete Consultation
                  </button>

                  <button
                    onClick={() => callPatient(primaryServing.id)}
                    className={`px-4 py-2.5 text-xs sm:text-sm font-medium rounded-full border flex items-center gap-2 transition-all ${
                      isDark
                        ? 'bg-white/[0.05] border-white/10 text-slate-200 hover:bg-white/[0.1] hover:border-teal-400/40'
                        : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
                    }`}
                    title="Play chime on hospital speakers"
                  >
                    <Volume2 className="w-4 h-4 text-teal-400" />
                    Re-Call Chime
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center text-slate-500 mx-auto mb-3">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm">Station Counter Idle</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Call the next waiting patient from the queue to start a consultation.
                </p>
                {waitingPatients.length > 0 && (
                  <button
                    onClick={() => callPatient(waitingPatients[0].id)}
                    className="mt-4 px-5 py-2 text-xs font-semibold rounded-full bg-teal-400 text-slate-950 hover:brightness-110 shadow-md inline-flex items-center gap-1.5"
                  >
                    Call Next: Token {waitingPatients[0].tokenNumber}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Department Distribution Mini-Card */}
          <div
            className={`rounded-2xl border p-6 transition-all ${
              isDark
                ? 'bg-[#0B1526]/80 border-white/10 text-white shadow-xl'
                : 'bg-white border-slate-200 text-slate-900 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold tracking-tight">Specialty Distribution</h3>
              <span className="text-[11px] font-mono text-slate-400">TODAY</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {DEPARTMENTS.slice(0, 4).map((dept) => {
                const count = patients.filter(
                  (p) => p.department === dept.name && p.status !== 'Cancelled'
                ).length;
                return (
                  <div
                    key={dept.name}
                    className={`p-3 rounded-xl border ${
                      isDark ? 'bg-white/[0.03] border-white/5' : 'bg-[#F4F7FB] border-slate-200/80'
                    }`}
                  >
                    <span className="text-xs text-slate-400 truncate block">{dept.name}</span>
                    <span className="text-xl font-bold font-mono text-teal-400 tabular-nums block mt-1">
                      {count} <span className="text-xs font-normal text-slate-500">cases</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming Queue Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div
            className={`rounded-2xl border p-6 transition-all ${
              isDark
                ? 'bg-[#0B1526]/80 border-white/10 text-white shadow-xl'
                : 'bg-white border-slate-200 text-slate-900 shadow-xs'
            }`}
          >
            <div
              className={`flex items-center justify-between pb-3 border-b ${
                isDark ? 'border-white/10' : 'border-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold">Upcoming in Queue</h3>
                <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-400/15 border border-amber-400/30 text-amber-300 rounded-full tabular-nums">
                  {waitingPatients.length} Waiting
                </span>
              </div>
              <button
                onClick={() => setCurrentView('live-queue')}
                className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1"
              >
                View Table <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {waitingPatients.length === 0 ? (
                <div className="py-10 text-center text-slate-500 text-xs">
                  <p>Queue is currently clear.</p>
                  <button
                    onClick={seedMorePatients}
                    className="mt-3 text-xs text-teal-400 font-medium hover:underline inline-flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Add sample patient
                  </button>
                </div>
              ) : (
                waitingPatients.slice(0, 4).map((pt, idx) => (
                  <div
                    key={pt.id}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      isDark
                        ? 'bg-white/[0.03] border-white/5 hover:border-teal-400/40'
                        : 'bg-white border-slate-200 hover:border-teal-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg font-mono text-xs font-bold flex items-center justify-center shrink-0 ${
                          isDark ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-sm text-teal-300 tabular-nums">
                            {pt.tokenNumber}
                          </span>
                          <span className="text-xs font-semibold truncate">{pt.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span className="text-teal-400 font-medium truncate">{pt.department}</span>
                          <span>·</span>
                          <span className="tabular-nums">Est. {pt.estimatedWaitMinutes}m</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => callPatient(pt.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all shrink-0 ${
                        isDark
                          ? 'bg-teal-400/15 border border-teal-400/30 text-teal-300 hover:bg-teal-400/25'
                          : 'bg-[#CCFBF1] hover:bg-teal-200 text-teal-800'
                      }`}
                    >
                      Call Next
                    </button>
                  </div>
                ))
              )}
            </div>

            {waitingPatients.length > 4 && (
              <div
                className={`mt-3 pt-3 border-t text-center ${
                  isDark ? 'border-white/10' : 'border-slate-100'
                }`}
              >
                <button
                  onClick={() => setCurrentView('live-queue')}
                  className="text-xs text-slate-400 hover:text-white font-medium"
                >
                  +{waitingPatients.length - 4} more patients in queue
                </button>
              </div>
            )}
          </div>

          {/* Recent Registrations List */}
          <div
            className={`rounded-2xl border p-6 transition-all ${
              isDark
                ? 'bg-[#0B1526]/80 border-white/10 text-white shadow-xl'
                : 'bg-white border-slate-200 text-slate-900 shadow-xs'
            }`}
          >
            <h3 className="text-sm font-bold mb-3">Recent Activity</h3>
            <div className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-100'}`}>
              {recentRegistrations.map((pt) => {
                return (
                  <div key={pt.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mono font-bold text-teal-400 tabular-nums">
                        {pt.tokenNumber}
                      </span>
                      <span className="font-medium truncate">{pt.name}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-slate-500 text-[11px]">{pt.registrationTime}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          pt.status === 'Waiting'
                            ? 'bg-amber-400/15 text-amber-300 border-amber-400/30'
                            : pt.status === 'Serving'
                            ? 'bg-teal-400/15 text-teal-300 border-teal-400/30'
                            : pt.status === 'Served'
                            ? 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30'
                            : 'bg-slate-500/15 text-slate-400 border-slate-500/30'
                        }`}
                      >
                        {pt.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
