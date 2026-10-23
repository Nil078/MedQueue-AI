import React, { useState, useMemo } from 'react';
import { useQueue } from '../../context/QueueContext';
import { Patient, PatientStatus } from '../../types/queue';
import { DEPARTMENTS } from '../../data/mockData';
import {
  Search,
  Volume2,
  CheckCircle,
  Play,
  RotateCcw,
  Sparkles,
  Filter,
  X,
  Stethoscope,
  Clock,
  UserCheck,
  Tag,
  AlertCircle,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import { ConfirmationModal } from '../common/ConfirmationModal';

export const LiveQueueView: React.FC = () => {
  const {
    patients,
    callPatient,
    markServing,
    markServed,
    cancelPatient,
    seedMorePatients,
    settings,
  } = useQueue();

  const isDark = settings.theme === 'dark';

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<PatientStatus | 'All'>('All');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');

  // Confirmation Modal state for cancellation
  const [patientToCancel, setPatientToCancel] = useState<Patient | null>(null);

  // Filtered patient list
  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      if (selectedStatus !== 'All' && patient.status !== selectedStatus) {
        return false;
      }
      if (selectedDepartment !== 'All' && patient.department !== selectedDepartment) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchToken = patient.tokenNumber.toLowerCase().includes(q);
        const matchName = patient.name.toLowerCase().includes(q);
        const matchNotes = patient.notes?.toLowerCase().includes(q) || false;
        if (!matchToken && !matchName && !matchNotes) {
          return false;
        }
      }
      return true;
    });
  }, [patients, selectedStatus, selectedDepartment, searchQuery]);

  // Counts for tabs
  const counts = useMemo(() => {
    return {
      All: patients.filter((p) => p.status !== 'Cancelled').length,
      Waiting: patients.filter((p) => p.status === 'Waiting').length,
      Serving: patients.filter((p) => p.status === 'Serving').length,
      Served: patients.filter((p) => p.status === 'Served').length,
    };
  }, [patients]);

  // Next waiting patient in line
  const nextWaitingPatient = useMemo(() => {
    return patients.find((p) => p.status === 'Waiting');
  }, [patients]);

  const handleCallNext = () => {
    if (nextWaitingPatient) {
      callPatient(nextWaitingPatient.id, 'Room 102');
    }
  };

  const getStatusBadge = (status: PatientStatus) => {
    switch (status) {
      case 'Waiting':
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              isDark
                ? 'bg-amber-400/10 border-amber-400/30 text-amber-300'
                : 'bg-[#FEF3C7] text-amber-800 border-amber-300'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
            Waiting
          </span>
        );
      case 'Serving':
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              isDark
                ? 'bg-teal-400/15 border-teal-400/40 text-teal-300 shadow-[0_0_12px_rgba(45,212,191,0.2)]'
                : 'bg-[#CCFBF1] text-teal-800 border-teal-300'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf] animate-pulse" />
            Serving
          </span>
        );
      case 'Served':
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              isDark
                ? 'bg-emerald-400/10 border-emerald-400/30 text-emerald-300'
                : 'bg-[#DCFCE7] text-green-800 border-green-300'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
            Served
          </span>
        );
      case 'Cancelled':
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              isDark
                ? 'bg-white/5 border-white/10 text-slate-400'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Search & Actions Bar with Lunetra Glass Surface */}
      <div
        className={`rounded-2xl border p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all ${
          isDark
            ? 'bg-[#0B1526]/80 border-white/10 text-white shadow-xl'
            : 'bg-white border-slate-200 text-slate-900 shadow-xs'
        }`}
      >
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by token (e.g. MQ-102) or patient name..."
            className={`w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-full border transition-all focus:outline-none ${
              isDark
                ? 'bg-black/40 border-white/10 text-white placeholder-slate-500 focus:border-teal-400 focus:ring-1 focus:ring-teal-400/40'
                : 'bg-white border-slate-300 text-slate-900 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Department dropdown filter */}
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className={`px-4 py-2.5 text-xs sm:text-sm rounded-full border transition-colors font-medium focus:outline-none ${
              isDark
                ? 'bg-[#0E1A2D] border-white/10 text-teal-300'
                : 'bg-white border-slate-300 text-slate-700'
            }`}
          >
            <option value="All">All Specialties</option>
            {DEPARTMENTS.map((d) => (
              <option key={d.name} value={d.name} className={isDark ? 'bg-[#0E1A2D] text-white' : ''}>
                {d.name}
              </option>
            ))}
          </select>

          {/* Quick Call Next Button */}
          <button
            onClick={handleCallNext}
            disabled={!nextWaitingPatient}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-full transition-all group whitespace-nowrap shadow-lg ${
              isDark
                ? 'bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 hover:brightness-110 disabled:opacity-40 shadow-[0_0_20px_rgba(45,212,191,0.25)]'
                : 'bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50'
            }`}
            title={nextWaitingPatient ? `Call ${nextWaitingPatient.tokenNumber}` : 'No waiting patients'}
          >
            <Volume2 className="w-4 h-4" />
            <span>Call Next</span>
            {nextWaitingPatient && (
              <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-slate-950/20 font-bold">
                {nextWaitingPatient.tokenNumber}
              </span>
            )}
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-0.5 ${
                isDark ? 'bg-slate-950/20 text-slate-950' : 'bg-white/20 text-white'
              }`}
            >
              <ArrowRight className="w-2.5 h-2.5 stroke-[3]" />
            </div>
          </button>

          {/* Add Sample Demo Patient */}
          <button
            onClick={seedMorePatients}
            className={`p-2.5 sm:px-4 sm:py-2.5 text-xs font-semibold rounded-full border transition-all flex items-center gap-1.5 ${
              isDark
                ? 'bg-white/[0.05] border-white/10 text-slate-200 hover:bg-white/[0.1] hover:border-teal-400/40'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="Seed sample patient"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Add Sample</span>
          </button>
        </div>
      </div>

      {/* Status Segmented Filter Tabs */}
      <div
        className={`flex items-center gap-1.5 p-1 rounded-2xl border transition-all overflow-x-auto ${
          isDark ? 'bg-[#0B1526]/80 border-white/10' : 'bg-white border-slate-200/90'
        }`}
      >
        {(['All', 'Waiting', 'Serving', 'Served'] as const).map((tab) => {
          const isActive = selectedStatus === tab;
          return (
            <button
              key={tab}
              onClick={() => setSelectedStatus(tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? isDark
                    ? 'bg-white/10 text-white border border-teal-400/40 shadow-[0_0_15px_rgba(45,212,191,0.15)] font-semibold'
                    : 'bg-[#142D4E] text-white shadow-xs font-semibold'
                  : isDark
                  ? 'text-slate-400 hover:text-white hover:bg-white/5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {isActive && isDark && (
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_#2dd4bf]" />
              )}
              <span>{tab}</span>
              <span
                className={`tabular-nums text-xs px-2 py-0.2 rounded-full ${
                  isActive
                    ? isDark
                      ? 'bg-teal-400/20 text-teal-300'
                      : 'bg-white/20 text-white'
                    : isDark
                    ? 'bg-white/5 text-slate-400'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {counts[tab]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Patient Queue Table */}
      <div
        className={`rounded-3xl border overflow-hidden transition-all shadow-xl ${
          isDark
            ? 'bg-[#0B1526]/85 border-white/10 text-white'
            : 'bg-white border-slate-200 text-slate-700 shadow-xs'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead
              className={`border-b text-[10px] font-mono font-bold uppercase tracking-wider ${
                isDark
                  ? 'bg-white/[0.02] border-white/10 text-slate-400'
                  : 'bg-[#F8FAFC] border-slate-200 text-slate-500'
              }`}
            >
              <tr>
                <th scope="col" className="px-4 sm:px-6 py-4">
                  Token #
                </th>
                <th scope="col" className="px-4 sm:px-6 py-4">
                  Patient Name
                </th>
                <th scope="col" className="px-4 sm:px-6 py-4">
                  Age / Gender
                </th>
                <th scope="col" className="px-4 sm:px-6 py-4">
                  Department
                </th>
                <th scope="col" className="px-4 sm:px-6 py-4">
                  Reg. Time
                </th>
                <th scope="col" className="px-4 sm:px-6 py-4">
                  Est. Wait Time
                </th>
                <th scope="col" className="px-4 sm:px-6 py-4">
                  Status
                </th>
                <th scope="col" className="px-4 sm:px-6 py-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-100'}`}>
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-14 text-center text-slate-400">
                    <div className="max-w-sm mx-auto space-y-2">
                      <p className="font-semibold text-base">No patients found</p>
                      <p className="text-xs text-slate-500">
                        Adjust your search filters or generate a new patient ticket.
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedStatus('All');
                          setSelectedDepartment('All');
                        }}
                        className="mt-2 text-xs font-semibold text-teal-400 hover:underline"
                      >
                        Reset filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => {
                  return (
                    <tr
                      key={patient.id}
                      className={`transition-colors ${
                        patient.status === 'Serving'
                          ? isDark
                            ? 'bg-teal-400/[0.05]'
                            : 'bg-teal-50/30'
                          : isDark
                          ? 'hover:bg-white/[0.02]'
                          : 'hover:bg-slate-50/80'
                      }`}
                    >
                      {/* Token Number */}
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-sm sm:text-base text-teal-300 tabular-nums">
                          {patient.tokenNumber}
                        </span>
                        {patient.priority !== 'Normal' && (
                          <span className="block text-[10px] font-semibold text-rose-400 font-mono">
                            {patient.priority}
                          </span>
                        )}
                      </td>

                      {/* Patient Name */}
                      <td className="px-4 sm:px-6 py-4">
                        <div className="font-semibold">{patient.name}</div>
                        {patient.notes && (
                          <div className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                            {patient.notes}
                          </div>
                        )}
                      </td>

                      {/* Age & Gender */}
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-slate-400 font-medium">
                        {patient.age} yrs · {patient.gender === 'Prefer not to say' ? 'N/A' : patient.gender}
                      </td>

                      {/* Department */}
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${
                            isDark
                              ? 'bg-white/[0.04] border-white/10 text-teal-300'
                              : 'bg-[#F4F7FB] border-slate-200 text-teal-900'
                          }`}
                        >
                          {patient.department}
                        </span>
                      </td>

                      {/* Registration Time */}
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap font-mono text-slate-400 tabular-nums">
                        {patient.registrationTime}
                      </td>

                      {/* Estimated Waiting Time */}
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap font-mono tabular-nums">
                        {patient.status === 'Waiting' ? (
                          <span className="text-amber-400 font-semibold">
                            ~{patient.estimatedWaitMinutes} min
                          </span>
                        ) : patient.status === 'Serving' ? (
                          <span className="text-teal-400 font-semibold">In Progress</span>
                        ) : (
                          <span className="text-slate-500">
                            {patient.servedTime ? `Done ${patient.servedTime}` : 'Completed'}
                          </span>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(patient.status)}
                      </td>

                      {/* Row Action Buttons */}
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* If Waiting: Call or Serve */}
                          {patient.status === 'Waiting' && (
                            <>
                              <button
                                onClick={() => callPatient(patient.id)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all flex items-center gap-1.5 ${
                                  isDark
                                    ? 'bg-teal-400/20 border-teal-400/40 text-teal-300 hover:bg-teal-400/30'
                                    : 'bg-[#CCFBF1] text-teal-800 hover:bg-teal-200 border-teal-200'
                                }`}
                                title="Play chime announcement"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                                <span>Call</span>
                              </button>
                              <button
                                onClick={() => markServing(patient.id)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                                  isDark
                                    ? 'bg-white/[0.05] border-white/10 text-slate-300 hover:bg-white/10'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                }`}
                                title="Set to Serving"
                              >
                                Serve
                              </button>
                            </>
                          )}

                          {/* If Serving: Complete or Re-call */}
                          {patient.status === 'Serving' && (
                            <>
                              <button
                                onClick={() => markServed(patient.id)}
                                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 shadow-md ${
                                  isDark
                                    ? 'bg-teal-400 text-slate-950 hover:brightness-110 shadow-[0_0_15px_rgba(45,212,191,0.3)]'
                                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                                }`}
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Complete</span>
                              </button>
                              <button
                                onClick={() => callPatient(patient.id)}
                                className={`p-1.5 rounded-full border transition-colors ${
                                  isDark
                                    ? 'border-white/10 text-teal-400 hover:bg-white/10'
                                    : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                                }`}
                                title="Re-chime"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}

                          {/* If Served */}
                          {patient.status === 'Served' && (
                            <span className="text-xs text-slate-500 font-mono font-medium">
                              Discharged
                            </span>
                          )}

                          {/* Cancel Option */}
                          {patient.status !== 'Served' && patient.status !== 'Cancelled' && (
                            <button
                              onClick={() => setPatientToCancel(patient)}
                              className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-full transition-colors"
                              title="Cancel ticket"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div
          className={`px-4 sm:px-6 py-3.5 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-xs ${
            isDark
              ? 'bg-white/[0.02] border-white/10 text-slate-400'
              : 'bg-[#F8FAFC] border-slate-200 text-slate-500'
          }`}
        >
          <span>
            Displaying <strong className="text-white font-mono">{filteredPatients.length}</strong> records of{' '}
            <strong className="text-white font-mono">{patients.length}</strong> total
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[11px]">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            Active Service Standard: ~{settings.avgConsultationMinutes}m
          </span>
        </div>
      </div>

      {/* Confirmation Modal for Ticket Cancellation */}
      <ConfirmationModal
        isOpen={!!patientToCancel}
        title="Cancel Patient Queue Token?"
        message={`Are you sure you want to cancel token ${patientToCancel?.tokenNumber} for ${patientToCancel?.name}? This will remove them from the active queue.`}
        confirmLabel="Cancel Token"
        cancelLabel="Keep Patient"
        isDestructive={true}
        onConfirm={() => {
          if (patientToCancel) {
            cancelPatient(patientToCancel.id);
            setPatientToCancel(null);
          }
        }}
        onCancel={() => setPatientToCancel(null)}
      />
    </div>
  );
};
