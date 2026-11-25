import React from 'react';
import {
  ArrowDownUp,
  BookmarkPlus,
  Calculator,
  Copy,
  Info,
  Percent,
  RotateCcw,
  Share2,
} from 'lucide-react';
import {
  DEFAULT_TAX_RATE,
  NETWORKS,
  NetworkId,
  QUICK_AMOUNTS,
  TAX_PRESETS,
  calculateLoadToBalance,
  calculateRequiredLoad,
  formatPkr,
  getNetworkInfo,
  sanitizeAmount,
  sanitizeRate,
} from '../utils/calculator';

interface CalculatorViewProps {
  network: NetworkId;
  onNetworkChange: (net: NetworkId) => void;
  taxRate: number;
  onTaxRateChange: (rate: number) => void;
  loadInput: string;
  onLoadInputChange: (val: string) => void;
  requiredInput: string;
  onRequiredInputChange: (val: string) => void;
  onSaveEntry: (mode: 'load' | 'target', inputAmount: number, outputAmount: number, secondaryAmount: number) => void;
  onNotify: (message: string) => void;
}

export const CalculatorView: React.FC<CalculatorViewProps> = ({
  network,
  onNetworkChange,
  taxRate,
  onTaxRateChange,
  loadInput,
  onLoadInputChange,
  requiredInput,
  onRequiredInputChange,
  onSaveEntry,
  onNotify,
}) => {
  const numericLoad = sanitizeAmount(loadInput);
  const numericTarget = sanitizeAmount(requiredInput);
  const loadResult = calculateLoadToBalance(numericLoad, taxRate);
  const targetResult = calculateRequiredLoad(numericTarget, taxRate);
  const activeNetInfo = getNetworkInfo(network);

  const copyText = async (text: string, label: string) => {
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
      onNotify(label);
    } catch {
      onNotify('Unable to copy automatically');
    }
  };

  const shareText = async (title: string, text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text });
        return;
      } catch {
        // Fallback to copy if share dismissed or unsupported
      }
    }
    await copyText(text, 'Result copied to clipboard');
  };

  const handleCopyLoad = () => {
    const msg = `${activeNetInfo.name} Load: ${formatPkr(loadResult.rechargeAmount, 0)} -> Net Balance: ${formatPkr(loadResult.netBalance)} (Tax ${loadResult.taxRatePercent}%: ${formatPkr(loadResult.taxAmount)})`;
    void copyText(msg, 'Load calculation copied');
  };

  const handleShareLoad = () => {
    const msg = `${activeNetInfo.name} Mobile Load: ${formatPkr(loadResult.rechargeAmount, 0)} gives Net Balance: ${formatPkr(loadResult.netBalance)}`;
    void shareText('Pakistan Mobile Load Calculation', msg);
  };

  const handleCopyRequired = () => {
    const msg = `${activeNetInfo.name} Target Balance: ${formatPkr(targetResult.targetBalance, 0)} -> Required Load: ${formatPkr(targetResult.recommendedLoad, 0)} (Receives ${formatPkr(targetResult.actualNetReceived)})`;
    void copyText(msg, 'Required load copied');
  };

  const handleShareRequired = () => {
    const msg = `To get ${formatPkr(targetResult.targetBalance, 0)} balance on ${activeNetInfo.name}, load ${formatPkr(targetResult.recommendedLoad, 0)}`;
    void shareText('Pakistan Mobile Load Calculation', msg);
  };

  return (
    <div className="space-y-6">
      {/* Intro & Operator Segmented Control */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span>Pakistan Telecom Utility</span>
              <span aria-hidden="true">·</span>
              <span>Offline Ready</span>
              <span aria-hidden="true">·</span>
              <span>{activeNetInfo.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white text-balance">
              Pakistan Mobile Load Calculator
            </h1>
          </div>

          <div
            role="group"
            aria-label="Mobile network operator"
            className="flex flex-wrap sm:grid sm:grid-cols-5 gap-1.5 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 w-full lg:w-auto"
          >
            {NETWORKS.map((item) => {
              const isSelected = network === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onNetworkChange(item.id);
                    onNotify(`Network set to ${item.name}`);
                  }}
                  aria-pressed={isSelected}
                  style={isSelected ? { borderBottomColor: item.accentHex } : undefined}
                  className={`flex-1 sm:flex-none min-h-[44px] px-3.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-150 flex items-center justify-center border-b-2 ${
                    isSelected
                      ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                      : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tax Rate & Quick Recharge Row */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Tax Rate Settings */}
        <div className="lg:col-span-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 flex flex-col justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Percent className="w-4 h-4" />
              </div>
              <div>
                <label htmlFor="taxRateInput" className="block text-sm font-bold text-slate-900 dark:text-white">
                  Deduction / Tax Rate
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Standard Pakistan WHT &amp; FED rate is 13.04%
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="relative flex-1 sm:flex-none">
                <input
                  id="taxRateInput"
                  type="number"
                  min="0"
                  max="99"
                  step="0.01"
                  inputMode="decimal"
                  value={taxRate}
                  onChange={(e) => onTaxRateChange(sanitizeRate(e.target.value))}
                  className="w-full sm:w-24 min-h-[44px] pl-3 pr-7 text-right rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono-num font-bold text-sm text-slate-900 dark:text-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                  %
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onTaxRateChange(DEFAULT_TAX_RATE);
                  onNotify('Tax rate reset to 13.04%');
                }}
                aria-label="Reset tax rate to 13.04%"
                className="min-h-[44px] px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {TAX_PRESETS.map((preset) => {
              const active = Math.abs(taxRate - preset.rate) < 0.001;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => onTaxRateChange(preset.rate)}
                  className={`min-h-[38px] px-3 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {preset.label} ({preset.rate}%)
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Recharge Amounts */}
        <div className="lg:col-span-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-bold text-slate-900 dark:text-white">Quick Recharge Amounts</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Tap to fill Load</span>
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
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
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
                  Enter recharge amount to calculate usable main balance after tax.
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

            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 p-4 space-y-2.5">
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
              <div className="pt-2.5 border-t border-slate-200 dark:border-slate-700/70 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Tax Deducted ({loadResult.taxRatePercent.toFixed(2)}%)</span>
                <span data-testid="deduction-result" className="font-mono-num font-bold text-rose-600 dark:text-rose-400">
                  {formatPkr(loadResult.taxAmount)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Save load calculation"
              onClick={() =>
                onSaveEntry('load', loadResult.rechargeAmount, loadResult.netBalance, loadResult.taxAmount)
              }
              className="min-h-[44px] px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <BookmarkPlus className="w-4 h-4" />
              Save
            </button>
            <button
              type="button"
              aria-label="Copy load calculation result"
              onClick={handleCopyLoad}
              className="flex-1 min-h-[44px] px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <Copy className="w-4 h-4" />
              Copy Result
            </button>
            <button
              type="button"
              onClick={handleShareLoad}
              aria-label="Share Load to Balance result"
              className="min-h-[44px] min-w-[44px] px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors"
            >
              <Share2 className="w-4 h-4" />
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

          <div className="flex items-center gap-2">
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
              className="min-h-[44px] px-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <BookmarkPlus className="w-4 h-4" />
              Save
            </button>
            <button
              type="button"
              aria-label="Copy target load calculation result"
              onClick={handleCopyRequired}
              className="flex-1 min-h-[44px] px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <Copy className="w-4 h-4" />
              Copy Result
            </button>
            <button
              type="button"
              onClick={handleShareRequired}
              aria-label="Share Target Balance result"
              className="min-h-[44px] min-w-[44px] px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Detailed Tax Deduction Breakdown */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Tax Deduction Breakdown
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Based on Load Input ({formatPkr(loadResult.rechargeAmount, 0)})
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
              Recharge Amount
            </div>
            <div className="text-lg font-bold font-mono-num text-slate-900 dark:text-white">
              {formatPkr(loadResult.rechargeAmount, 0)}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
              WHT / FED Tax ({loadResult.taxRatePercent.toFixed(2)}%)
            </div>
            <div className="text-lg font-bold font-mono-num text-rose-600 dark:text-rose-400">
              {formatPkr(loadResult.taxAmount)}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
              Retention Share
            </div>
            <div className="text-lg font-bold font-mono-num text-indigo-600 dark:text-indigo-400">
              {loadResult.retentionPercent.toFixed(2)}%
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
              Net Usable Credit
            </div>
            <div className="text-lg font-bold font-mono-num text-emerald-700 dark:text-emerald-400">
              {formatPkr(loadResult.netBalance)}
            </div>
          </div>
        </div>
      </section>

      {/* Formula Note */}
      <div className="rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 p-4 flex items-start gap-3 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 leading-relaxed">
        <Info className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
        <p>
          <strong>How it works:</strong> Net Balance = Recharge Amount × (1 − Tax Rate). For target
          packages, the required load is divided by the net retention rate and rounded up to the
          nearest rupee so your main balance never falls short.
        </p>
      </div>
    </div>
  );
};
