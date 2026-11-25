import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-16 md:top-5 right-4 left-4 md:left-auto z-50 md:max-w-sm bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-lg border border-slate-800 dark:border-slate-200 flex items-center gap-3 text-sm font-semibold pointer-events-none transition-opacity duration-150"
    >
      <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
      <span className="truncate">{message}</span>
    </div>
  );
};
