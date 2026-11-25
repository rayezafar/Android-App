import React from 'react';
import {
  ArrowDownUp,
  BookmarkPlus,
  Calculator,
  Share2,
} from 'lucide-react';
import {
  DEFAULT_TAX_RATE,
  QUICK_AMOUNTS,
  calculateLoadToBalance,
  calculateRequiredLoad,
  formatPkr,
  sanitizeAmount,
} from '../utils/calculator';

interface CalculatorViewProps {
  loadInput: string;
  onLoadInputChange: (val: string) => void;
  requiredInput: string;
  onRequiredInputChange: (val: string) => void;
  onSaveEntry: (
    mode: 'load' | 'target',
    inputAmount: number,
    outputAmount: number,
    secondaryAmount: number
  ) => void;
  onNotify: (message: string) => void;
}

export const CalculatorView: React.FC<CalculatorViewProps> = ({
  loadInput,
  onLoadInputChange,
  requiredInput,
  onRequiredInputChange,
  onSaveEntry,
  onNotify,
}) => {
  const numericLoad = sanitizeAmount(loadInput);
  const numericTarget = sanitizeAmount(requiredInput);
  const loadResult = calculateLoadToBalance(numericLoad, DEFAULT_TAX_RATE);
  const targetResult = calculateRequiredLoad(numericTarget, DEFAULT_TAX_RATE);

  const shareText = async (title: string, text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text });
        return;
      } catch {
        // Fallback to clipboard copy if share is dismissed or unsupported
      }
    }

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
      onNotify('Result copied to share');
    } catch {
      onNotify('Unable to share automatically');
    }
  };

  const handleShareLoad = () => {
    const msg = `Mobile Load: ${formatPkr(loadResult.rechargeAmount, 0)} gives Net Balance: ${formatPkr(loadResult.netBalance)}`;
    void shareText('Pakistan Mobile Load Calculation', msg);
  };

  const handleShareRequired = () => {
    const msg = `To get ${formatPkr(targetResult.targetBalance, 0)} balance, load ${formatPkr(targetResult.recommendedLoad, 0)}`;
    void shareText('Pakistan Mobile Load Calculation', msg);
  };

  return (
    <div className="space-y-5">
      {/* Header & Quick Recharge Strip */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Pakistan Telecom Utility</span>
            <span aria-hidden="true">·</span>
            <span>Offline Ready</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white text-balance">
            Pakistan Mobile Load Calculator
          </h1>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Quick Recharge Amounts
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Tap to fill Load
            </span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {QUICK_AMOUNTS.map((amount) => {
              const active = numericLoad === amount;
              return (
                <button
                  key={amount}
                  type="button"
                  onClick={() => onLoadInputChange(String(amount))}
                  className={`min-h-[44px] px-2 rounded-xl font-mono-num text-xs sm:text-sm font-bold border transition-all duration-150 whitespace-nowrap ${
                    active
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200 hover:border-emerald-500'
                  }`}
                >
                  Rs. {amount}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Calculators Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        {/* Card A: Load -> Balance */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 flex flex-col justify-between gap-5">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  Option A · Forward Calculation
                </p>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  Load to Net Balance
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Enter recharge amount to calculate usable main balance.
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <ArrowDownUp className="w-5 h-5" />
              </div>
            </div>

            <div>
              <label
                htmlFor="loadInput"
                className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2"
              >
                Recharge Amount (Rs.)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono-num font-bold text-slate-400 text-base pointer-events-none">
                  Rs.
                </span>
                <input
                  id="loadInput"
                  type="number"
                  min="0"
                  step="1"
                  inputMode="decimal"
                  placeholder="320"
                  value={loadInput}
                  onChange={(e) => onLoadInputChange(e.target.value)}
                  className="w-full h-14 pl-14 pr-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono-num font-bold text-xl text-slate-900 dark:text-white outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                />
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Estimated Received Balance</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">Net Usable</span>
              </div>
              <div
                data-testid="received-result"
                className="text-3xl font-extrabold font-mono-num text-emerald-700 dark:text-emerald-400 tracking-tight"
              >
                {formatPkr(loadResult.netBalance)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              aria-label="Save load calculation"
              onClick={() =>
                onSaveEntry('load', loadResult.rechargeAmount, loadResult.netBalance, loadResult.taxAmount)
              }
              className="min-h-[44px] px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
            >
              <BookmarkPlus className="w-4 h-4" />
              Save
            </button>
            <button
              type="button"
              onClick={handleShareLoad}
              aria-label="Share Load to Balance result"
              className="min-h-[44px] px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>

        {/* Card B: Target Balance -> Required Load */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 flex flex-col justify-between gap-5">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-teal-700 dark:text-teal-400">
                  Option B · Reverse Package Calculator
                </p>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  Target Balance to Required Load
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Enter package price to find exact recharge needed so balance never falls short.
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center shrink-0">
                <Calculator className="w-5 h-5" />
              </div>
            </div>

            <div>
              <label
                htmlFor="requiredInput"
                className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2"
              >
                Target Balance Needed (Rs.)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono-num font-bold text-slate-400 text-base pointer-events-none">
                  Rs.
                </span>
                <input
                  id="requiredInput"
                  type="number"
                  min="0"
                  step="1"
                  inputMode="decimal"
                  placeholder="270"
                  value={requiredInput}
                  onChange={(e) => onRequiredInputChange(e.target.value)}
                  className="w-full h-14 pl-14 pr-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono-num font-bold text-xl text-slate-900 dark:text-white outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-500/10 transition-all"
                />
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Recommended Recharge</span>
                <span className="font-semibold text-teal-700 dark:text-teal-400">Rounded Up</span>
              </div>
              <div
                data-testid="needed-result"
                className="text-3xl font-extrabold font-mono-num text-teal-700 dark:text-teal-400 tracking-tight"
              >
                {formatPkr(targetResult.recommendedLoad, 0)}
              </div>
              <div className="pt-2.5 border-t border-slate-200 dark:border-slate-700/70 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Exact Balance After Tax</span>
                <span data-testid="exact-received" className="font-mono-num font-bold text-slate-800 dark:text-slate-200">
                  {formatPkr(targetResult.actualNetReceived)}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              aria-label="Save target load calculation"
              onClick={() =>
                onSaveEntry(
                  'target',
                  targetResult.targetBalance,
                  targetResult.recommendedLoad,
                  targetResult.actualNetReceived
                )
              }
              className="min-h-[44px] px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
            >
              <BookmarkPlus className="w-4 h-4" />
              Save
            </button>
            <button
              type="button"
              onClick={handleShareRequired}
              aria-label="Share Target Balance result"
              className="min-h-[44px] px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
