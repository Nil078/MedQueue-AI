import React, { useState } from 'react';
import { useQueue } from '../../context/QueueContext';
import { DepartmentType, PriorityLevel, Patient } from '../../types/queue';
import { DEPARTMENTS } from '../../data/mockData';
import {
  UserPlus,
  Printer,
  CheckCircle2,
  Copy,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Activity,
  Layers,
} from 'lucide-react';

export const RegisterPatientView: React.FC = () => {
  const { registerPatient, setCurrentView, showToast, settings } = useQueue();
  const isDark = settings.theme === 'dark';

  // Form states
  const [name, setName] = useState('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other' | 'Prefer not to say'>('Male');
  const [department, setDepartment] = useState<DepartmentType>('General Medicine');
  const [priority, setPriority] = useState<PriorityLevel>('Normal');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<{ name?: string; age?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success Confirmation Modal
  const [createdPatient, setCreatedPatient] = useState<Patient | null>(null);

  const validate = () => {
    const errs: { name?: string; age?: string } = {};
    if (!name.trim()) {
      errs.name = 'Patient full name is required.';
    } else if (name.trim().length < 2) {
      errs.name = 'Please provide a valid name (at least 2 characters).';
    }

    const numAge = parseInt(age, 10);
    if (!age.trim()) {
      errs.age = 'Patient age is required.';
    } else if (isNaN(numAge) || numAge <= 0 || numAge > 125) {
      errs.age = 'Please enter a realistic age between 1 and 125.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newPatient = registerPatient({
        name,
        age: parseInt(age, 10),
        gender,
        department,
        priority,
        phone: phone || undefined,
        notes: notes || undefined,
      });

      setCreatedPatient(newPatient);
      setIsSubmitting(false);

      // Reset form
      setName('');
      setAge('');
      setPhone('');
      setNotes('');
      setPriority('Normal');
      setErrors({});
    }, 250);
  };

  const handleCopyToken = () => {
    if (!createdPatient) return;
    navigator.clipboard.writeText(createdPatient.tokenNumber);
    showToast(`Token ${createdPatient.tokenNumber} copied to clipboard!`, 'success');
  };

  const handlePrintSlip = () => {
    window.print();
  };

  const handleFillDemo = () => {
    setName('Julian Alexander Thorne');
    setAge('45');
    setGender('Male');
    setDepartment('Cardiology');
    setPriority('Normal');
    setPhone('+1 (555) 723-9041');
    setNotes('Scheduled routine follow-up ECG check');
    setErrors({});
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Registration Card with Lunetra Glass Surface */}
      <div
        className={`rounded-3xl border overflow-hidden transition-all shadow-xl ${
          isDark
            ? 'bg-[#0B1526]/85 border-white/10 text-white'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        <div
          className={`p-6 sm:p-8 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            isDark ? 'border-white/10 bg-white/[0.02]' : 'border-slate-100 bg-slate-50/50'
          }`}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf]" />
              <span className="text-xs font-mono uppercase tracking-wider text-teal-400 font-semibold">
                Patient Intake Terminal
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2.5">
              <span>Allocate Outpatient Token</span>
            </h2>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Enter patient details to automatically assign the next sequential queue token.
            </p>
          </div>

          <button
            type="button"
            onClick={handleFillDemo}
            className={`self-start sm:self-auto text-xs font-semibold px-4 py-2 rounded-full border transition-all flex items-center gap-1.5 ${
              isDark
                ? 'bg-white/[0.06] border-white/10 text-teal-300 hover:bg-white/[0.12] hover:border-teal-400/40'
                : 'text-teal-700 bg-teal-50 hover:bg-teal-100 border-teal-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            Quick Demo Fill
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Patient Name */}
            <div>
              <label
                htmlFor="patient-name"
                className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-400 font-mono"
              >
                Patient Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                id="patient-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder="e.g. Johnathan Miller"
                className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none ${
                  isDark
                    ? 'bg-black/30 border-white/10 text-white placeholder-slate-500 focus:border-teal-400 focus:ring-1 focus:ring-teal-400/40'
                    : 'bg-white border-slate-300 text-slate-900 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20'
                } ${errors.name ? 'border-rose-400 bg-rose-500/10' : ''}`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-rose-400 font-medium">{errors.name}</p>
              )}
            </div>

            {/* Age */}
            <div>
              <label
                htmlFor="patient-age"
                className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-400 font-mono"
              >
                Age <span className="text-rose-400">*</span>
              </label>
              <input
                id="patient-age"
                type="number"
                min="1"
                max="125"
                value={age}
                onChange={(e) => {
                  setAge(e.target.value);
                  if (errors.age) setErrors((prev) => ({ ...prev, age: undefined }));
                }}
                placeholder="e.g. 42"
                className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none tabular-nums ${
                  isDark
                    ? 'bg-black/30 border-white/10 text-white placeholder-slate-500 focus:border-teal-400 focus:ring-1 focus:ring-teal-400/40'
                    : 'bg-white border-slate-300 text-slate-900 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20'
                } ${errors.age ? 'border-rose-400 bg-rose-500/10' : ''}`}
              />
              {errors.age && (
                <p className="mt-1 text-xs text-rose-400 font-medium">{errors.age}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label
                htmlFor="patient-gender"
                className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-400 font-mono"
              >
                Gender
              </label>
              <select
                id="patient-gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none ${
                  isDark
                    ? 'bg-[#0E1A2D] border-white/10 text-white focus:border-teal-400 focus:ring-1 focus:ring-teal-400/40'
                    : 'bg-white border-slate-300 text-slate-900 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20'
                }`}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            {/* Department */}
            <div>
              <label
                htmlFor="patient-dept"
                className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-400 font-mono"
              >
                Specialty / Department <span className="text-rose-400">*</span>
              </label>
              <select
                id="patient-dept"
                value={department}
                onChange={(e) => setDepartment(e.target.value as DepartmentType)}
                className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none font-medium ${
                  isDark
                    ? 'bg-[#0E1A2D] border-white/10 text-teal-300 focus:border-teal-400 focus:ring-1 focus:ring-teal-400/40'
                    : 'bg-white border-slate-300 text-teal-900 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20'
                }`}
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d.name} value={d.name} className={isDark ? 'bg-[#0E1A2D] text-white' : ''}>
                    {d.name} ({d.avgTime} min est. consultation)
                  </option>
                ))}
              </select>
            </div>

            {/* Priority / Triage */}
            <div>
              <label
                htmlFor="patient-priority"
                className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-400 font-mono"
              >
                Triage / Priority Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Normal', 'Priority', 'Urgent'] as PriorityLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setPriority(lvl)}
                    className={`py-2.5 px-3 text-xs font-semibold rounded-xl border transition-all text-center flex items-center justify-center gap-1.5 ${
                      priority === lvl
                        ? lvl === 'Urgent'
                          ? 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                          : lvl === 'Priority'
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                          : 'bg-teal-500/20 border-teal-400 text-teal-300 shadow-[0_0_12px_rgba(45,212,191,0.3)]'
                        : isDark
                        ? 'border-white/10 text-slate-400 hover:bg-white/[0.04]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {priority === lvl && (
                      <span className="w-1.5 h-1.5 rounded-full bg-current shadow-xs" />
                    )}
                    <span>{lvl}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Phone */}
            <div>
              <label
                htmlFor="patient-phone"
                className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-400 font-mono"
              >
                Contact Phone <span className="text-slate-500 font-normal">(SMS Alerts)</span>
              </label>
              <input
                id="patient-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className={`w-full px-4 py-3 rounded-xl border text-sm font-mono transition-all focus:outline-none ${
                  isDark
                    ? 'bg-black/30 border-white/10 text-white placeholder-slate-500 focus:border-teal-400 focus:ring-1 focus:ring-teal-400/40'
                    : 'bg-white border-slate-300 text-slate-900 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20'
                }`}
              />
            </div>
          </div>

          {/* Chief Complaint / Clinical Notes */}
          <div>
            <label
              htmlFor="patient-notes"
              className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-400 font-mono"
            >
              Intake Notes & Symptoms <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <textarea
              id="patient-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Mild chest tightness on exertion, primary consultation requested..."
              className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none ${
                isDark
                  ? 'bg-black/30 border-white/10 text-white placeholder-slate-500 focus:border-teal-400 focus:ring-1 focus:ring-teal-400/40'
                  : 'bg-white border-slate-300 text-slate-900 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20'
              }`}
            />
          </div>

          {/* Action Row */}
          <div
            className={`pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
              isDark ? 'border-white/10' : 'border-slate-100'
            }`}
          >
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_6px_#2dd4bf]" />
              <span>Current Average Waiting Time: ~{settings.avgConsultationMinutes} min</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="reset"
                onClick={() => {
                  setName('');
                  setAge('');
                  setPhone('');
                  setNotes('');
                  setErrors({});
                }}
                className={`w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-medium rounded-full transition-colors ${
                  isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Clear Form
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full sm:w-auto px-7 py-3 text-xs sm:text-sm font-semibold rounded-full shadow-lg transition-all flex items-center justify-center gap-2.5 group ${
                  isDark
                    ? 'bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 hover:brightness-110 shadow-[0_0_25px_rgba(45,212,191,0.3)]'
                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
              >
                {isSubmitting ? (
                  <span>Generating Token...</span>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Generate Queue Token</span>
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1 ${
                        isDark ? 'bg-slate-950/20 text-slate-950' : 'bg-white/20 text-white'
                      }`}
                    >
                      <ArrowRight className="w-2.5 h-2.5" />
                    </div>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Success Modal - Glowing Pass / Token Slip */}
      {createdPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div
            className={`relative w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden p-6 sm:p-8 animate-in zoom-in-95 duration-200 ${
              isDark
                ? 'bg-[#0B1526] border-teal-500/40 text-white shadow-[0_20px_60px_rgba(0,0,0,0.8)]'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Header */}
            <div className="text-center pb-4 border-b border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto mb-2 border border-teal-500/40 shadow-[0_0_15px_rgba(45,212,191,0.2)]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Intake Confirmed</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Outpatient token has been allocated to active queue.
              </p>
            </div>

            {/* Glowing Ticket Slip */}
            <div
              className={`my-5 p-6 rounded-2xl border ${
                isDark
                  ? 'bg-black/40 border-teal-500/30 shadow-[inset_0_0_20px_rgba(45,212,191,0.05)]'
                  : 'bg-[#F4F7FB] border-slate-200'
              }`}
            >
              <div className="text-center pb-3 border-b border-white/10">
                <div className="text-xs font-bold uppercase tracking-widest text-teal-400">
                  {settings.hospitalName}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {settings.departmentName} · Queue Token
                </div>
              </div>

              <div className="py-5 text-center">
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">
                  Assigned Token
                </div>
                <div className="text-5xl sm:text-6xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-white to-cyan-300 tracking-tight tabular-nums mt-1">
                  {createdPatient.tokenNumber}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs py-3 border-t border-white/10">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">
                    Patient Name
                  </span>
                  <span className="font-semibold text-white">{createdPatient.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">
                    Specialty
                  </span>
                  <span className="font-semibold text-teal-400">
                    {createdPatient.department}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">
                    Time Issued
                  </span>
                  <span className="font-mono text-slate-300">{createdPatient.registrationTime}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">
                    Est. Wait
                  </span>
                  <span className="font-mono font-bold text-amber-400">
                    ~{createdPatient.estimatedWaitMinutes} mins
                  </span>
                </div>
              </div>

              {/* Barcode line */}
              <div className="pt-3 border-t border-white/10 text-center">
                <div className="h-7 mx-auto max-w-[200px] flex items-stretch justify-center gap-1 opacity-70">
                  {[3, 1, 4, 2, 1, 3, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 4, 1].map((w, idx) => (
                    <div
                      key={idx}
                      className={isDark ? 'bg-teal-300' : 'bg-slate-800'}
                      style={{ width: `${w * 1.5}px` }}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                  REF: {createdPatient.id.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handlePrintSlip}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full border transition-all ${
                    isDark
                      ? 'bg-white/[0.06] border-white/10 hover:bg-white/[0.12] text-slate-200'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Slip
                </button>
                <button
                  type="button"
                  onClick={handleCopyToken}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full border transition-all ${
                    isDark
                      ? 'bg-white/[0.06] border-white/10 hover:bg-white/[0.12] text-slate-200'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setCreatedPatient(null)}
                  className={`flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-full border transition-all ${
                    isDark
                      ? 'bg-white/[0.06] border-white/10 text-teal-300 hover:bg-white/[0.1]'
                      : 'bg-teal-50 hover:bg-teal-100 text-teal-800'
                  }`}
                >
                  Register Another
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCreatedPatient(null);
                    setCurrentView('live-queue');
                  }}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-1 px-4 py-2 text-xs font-semibold rounded-full transition-all ${
                    isDark
                      ? 'bg-teal-400 text-slate-950 hover:brightness-110 shadow-[0_0_15px_rgba(45,212,191,0.3)]'
                      : 'bg-teal-600 hover:bg-teal-700 text-white'
                  }`}
                >
                  View Queue <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
