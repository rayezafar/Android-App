import React from 'react';
import { Clock, Copy, RotateCcw, Trash2 } from 'lucide-react';
import { HistoryEntry, formatPkr, getNetworkInfo } from '../utils/calculator';

interface HistoryViewProps {
  entries: HistoryEntry[];
  onClearAll: () => void;
  onDeleteEntry: (id: string) => void;
  onRestoreEntry: (entry: HistoryEntry) => void;
  onNotify: (msg: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  entries,
  onClearAll,
  onDeleteEntry,
  onRestoreEntry,
  onNotify,
}) => {
  const handleCopy = async (entry: HistoryEntry) => {
    const netName = getNetworkInfo(entry.network).name;
    const text =
      entry.mode === 'load'
        ? `${netName} Load ${formatPkr(entry.inputAmount, 0)} -> Net Balance ${formatPkr(entry.outputAmount)} (Tax ${entry.taxRatePercent}%)`
        : `${netName} Target ${formatPkr(entry.inputAmount, 0)} -> Load ${formatPkr(entry.outputAmount, 0)} (Receives ${formatPkr(entry.secondaryAmount)})`;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const el = document.createElement('textarea');
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      onNotify('Calculation copied to clipboard');
    } catch {
      onNotify('Unable to copy');
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Saved Calculation History
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Stored locally on your device for offline access.
            </p>
          </div>

          {entries.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="min-h-[44px] px-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950/70 text-xs font-semibold flex items-center justify-center gap-2 transition-colors whitespace-nowrap self-start sm:self-auto"
            >
              <Trash2 className="w-4 h-4" />
              Clear All History
            </button>
          )}
        </div>

        {entries.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 py-12 px-4 text-center space-y-2">
            <Clock className="w-8 h-8 text-slate-400 mx-auto" />
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No saved calculations yet
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Use the Save button on either calculator card to store recharge amounts or package loads here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {entries.map((entry) => {
              const netInfo = getNetworkInfo(entry.network);
              const timeLabel = new Date(entry.createdAt).toLocaleString([], {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              const headline =
                entry.mode === 'load'
                  ? `Load ${formatPkr(entry.inputAmount, 0)} → Net ${formatPkr(entry.outputAmount)}`
                  : `Target ${formatPkr(entry.inputAmount, 0)} → Load ${formatPkr(entry.outputAmount, 0)}`;

              const subtitle =
                entry.mode === 'load'
                  ? `${netInfo.name} · Tax ${entry.taxRatePercent.toFixed(2)}% (${formatPkr(entry.secondaryAmount)}) · ${timeLabel}`
                  : `${netInfo.name} · Tax ${entry.taxRatePercent.toFixed(2)}% · Receives ${formatPkr(entry.secondaryAmount)} · ${timeLabel}`;

              return (
                <div
                  key={entry.id}
                  className="py-3.5 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="font-mono-num text-sm font-bold text-slate-900 dark:text-white truncate">
                      {headline}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {subtitle}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onRestoreEntry(entry)}
                      className="min-h-[44px] px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Load
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleCopy(entry)}
                      aria-label={`Copy ${headline}`}
                      className="min-h-[44px] min-w-[44px] rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteEntry(entry.id)}
                      aria-label={`Delete ${headline}`}
                      className="min-h-[44px] min-w-[44px] rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950/60 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
