import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useQueue } from '../../context/QueueContext';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
}) => {
  const { settings } = useQueue();
  const isDark = settings.theme === 'dark';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className={`relative w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden p-6 sm:p-7 transition-all animate-in zoom-in-95 duration-200 ${
          isDark
            ? 'bg-[#0B1526] border-white/10 text-white shadow-[0_20px_60px_rgba(0,0,0,0.8)]'
            : 'bg-white border-slate-200 text-slate-900 shadow-xl'
        }`}
      >
        <button
          onClick={onCancel}
          className={`absolute top-5 right-5 p-1 rounded-full transition-colors ${
            isDark
              ? 'text-slate-400 hover:text-white hover:bg-white/10'
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
          }`}
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-2xl shrink-0 ${
              isDestructive
                ? isDark
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-rose-50 text-rose-600'
                : isDark
                ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                : 'bg-teal-50 text-teal-600'
            }`}
          >
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="flex-1 min-w-0 pr-6">
            <h3 className="text-base font-bold tracking-tight">{title}</h3>
            <p
              className={`mt-1.5 text-xs sm:text-sm leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {message}
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                className={`px-4 py-2 text-xs font-semibold rounded-full border transition-colors ${
                  isDark
                    ? 'border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/10'
                    : 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={`px-5 py-2 text-xs font-semibold text-white rounded-full transition-all shadow-md ${
                  isDestructive
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-900/30'
                    : 'bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold shadow-[0_0_15px_rgba(45,212,191,0.3)]'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
