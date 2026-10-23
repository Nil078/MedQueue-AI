import React, { useState, useEffect } from 'react';
import { useQueue } from '../../context/QueueContext';
import {
  Maximize2,
  Minimize2,
  Volume2,
  Clock,
  ArrowLeft,
  Activity,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const WaitingRoomView: React.FC = () => {
  const {
    patients,
    lastCalledPatient,
    settings,
    callPatient,
    setCurrentView,
  } = useQueue();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  // Clock
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setCurrentDate(
        now.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Find currently serving patient
  const currentlyServing = patients.filter((p) => p.status === 'Serving');
  const primaryServing = lastCalledPatient || currentlyServing[0] || null;

  // Next waiting patients
  const upcomingQueue = patients.filter((p) => p.status === 'Waiting').slice(0, 5);

  return (
    <div className="relative min-h-[85vh] flex flex-col justify-between bg-[#060D19] text-white rounded-3xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.8)] border border-white/10 transition-all p-6 sm:p-10">
      {/* Background radial glow & technical crosshair grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-70 pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top TV Bar: Hospital Branding, Live Clock, Fullscreen / Controls */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        {/* Hospital Branding */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(45,212,191,0.4)]">
            <Activity className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
                {settings.hospitalName}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-teal-400/15 border border-teal-400/30 text-[10px] font-mono text-teal-300">
                LIVE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-teal-400 font-semibold tracking-wider uppercase mt-0.5">
              {settings.departmentName} · Outpatient Queue Display
            </p>
          </div>
        </div>

        {/* Live TV Clock & Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-5">
          <div className="text-right">
            <div className="font-mono text-2xl sm:text-4xl font-black text-white tracking-wider tabular-nums">
              {currentTime}
            </div>
            <div className="text-xs text-slate-400 font-medium font-mono">{currentDate}</div>
          </div>

          <div className="flex items-center gap-2">
            {primaryServing && (
              <button
                onClick={() => callPatient(primaryServing.id)}
                className="p-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-teal-300 transition-colors"
                title="Test / Replay Audio Chime"
                aria-label="Replay audio announcement"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={toggleFullscreen}
              className="p-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-slate-200 transition-colors"
              title="Toggle Fullscreen Mode"
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-slate-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Split Screen: NOW SERVING (Left 60%) + NEXT IN LINE (Right 40%) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 items-stretch">
        {/* Giant NOW SERVING Display (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="bg-[#0B1528]/80 backdrop-blur-2xl rounded-3xl border-2 border-teal-400/60 p-8 sm:p-14 text-center shadow-[0_0_50px_rgba(45,212,191,0.2)] relative overflow-hidden">
            {/* Top Indicator */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-400/20 border border-teal-400/40 text-teal-300 font-bold text-xs uppercase tracking-widest shadow-xs mb-4">
              <span className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf] animate-ping" />
              Now Serving / En Consulta
            </div>

            {primaryServing ? (
              <div className="space-y-6">
                {/* Huge Token Number */}
                <div className="text-7xl sm:text-9xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-teal-300 tracking-tight tabular-nums drop-shadow-2xl">
                  {primaryServing.tokenNumber}
                </div>

                {/* Patient Name & Details */}
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                    {primaryServing.name}
                  </h2>
                  <div className="text-base sm:text-lg text-teal-400 font-semibold flex items-center justify-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-400/30">
                      {primaryServing.department}
                    </span>
                    <span>·</span>
                    <span>{primaryServing.age} yrs</span>
                  </div>
                </div>

                {/* Assigned Room / Counter Banner */}
                <div className="mt-8 p-4 sm:p-6 rounded-2xl bg-teal-950/70 border border-teal-400/40 flex items-center justify-center gap-3 max-w-md mx-auto shadow-lg">
                  <span className="text-xs uppercase tracking-wider text-teal-300 font-mono">
                    Please proceed to:
                  </span>
                  <span className="text-xl sm:text-3xl font-black text-teal-300 font-mono tracking-tight">
                    {primaryServing.counterOrRoom || 'Counter 1'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-16 space-y-4">
                <div className="text-4xl sm:text-6xl font-mono font-black text-slate-600">
                  ---
                </div>
                <p className="text-slate-400 text-base">
                  All counters are currently awaiting next patient intake.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* NEXT UP Queue Column (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-[#0B1528]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-6 sm:p-8 flex-1 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  Next to be Called
                </h3>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 font-mono">
                  {upcomingQueue.length} In Line
                </span>
              </div>

              {/* Next queue list items */}
              <div className="mt-5 space-y-3">
                {upcomingQueue.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 text-sm">
                    No other patients currently waiting in line.
                  </div>
                ) : (
                  upcomingQueue.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-teal-400/30 transition-all flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="w-8 h-8 rounded-xl bg-white/[0.06] text-slate-300 font-mono font-bold text-sm flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="text-xl sm:text-2xl font-mono font-black text-white tabular-nums">
                            {item.tokenNumber}
                          </div>
                          <div className="text-xs text-slate-300 font-medium">
                            {item.name}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-semibold bg-teal-400/15 text-teal-300 border border-teal-400/30">
                          {item.department}
                        </span>
                        <div className="text-xs text-amber-400 font-mono mt-1">
                          ~{item.estimatedWaitMinutes} min
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* TV Screen Hint */}
            <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs text-slate-400 font-mono">
              Audio announcements chime automatically when your token is summoned.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Ticker for Hospital Waiting Lounge */}
      <div className="relative z-10 p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_6px_#2dd4bf] shrink-0" />
          <span className="font-semibold text-white">Lounge Advisory:</span>
          <span>Please keep your identification and insurance documents ready for consultation.</span>
        </div>
        <div className="text-teal-400 font-medium font-mono whitespace-nowrap">
          Pharmacy & Lab Collections on 1st Floor · Station 02
        </div>
      </div>
    </div>
  );
};
