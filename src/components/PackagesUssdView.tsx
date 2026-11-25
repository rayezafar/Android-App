import React from 'react';
import { ArrowRight, Copy, Phone } from 'lucide-react';
import {
  NETWORKS,
  NetworkId,
  calculateRequiredLoad,
  formatPkr,
} from '../utils/calculator';

interface PackagesUssdViewProps {
  selectedNetwork: NetworkId;
  onSelectNetwork: (net: NetworkId) => void;
  taxRate: number;
  onUsePackageInCalculator: (targetPrice: number, net: NetworkId) => void;
  onNotify: (msg: string) => void;
}

const CARRIERS = NETWORKS.filter((n) => n.id !== 'all');

export const PackagesUssdView: React.FC<PackagesUssdViewProps> = ({
  selectedNetwork,
  onSelectNetwork,
  taxRate,
  onUsePackageInCalculator,
  onNotify,
}) => {
  const activeCarrier =
    CARRIERS.find((c) => c.id === selectedNetwork) ?? CARRIERS[0];

  const handleCopyCode = async (code: string, label: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
      } else {
        const el = document.createElement('textarea');
        el.value = code;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      onNotify(`${label} code ${code} copied`);
    } catch {
      onNotify(`Code: ${code}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Carrier Filter Bar */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white text-balance">
              Packages &amp; USSD Dial Codes
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Dial balance codes directly on Android or send any package price to the load calculator.
            </p>
          </div>

          <div
            role="group"
            aria-label="Select mobile operator"
            className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 w-full sm:w-auto"
          >
            {CARRIERS.map((carrier) => {
              const active = activeCarrier.id === carrier.id;
              return (
                <button
                  key={carrier.id}
                  type="button"
                  onClick={() => onSelectNetwork(carrier.id)}
                  aria-pressed={active}
                  style={active ? { borderBottomColor: carrier.accentHex } : undefined}
                  className={`min-h-[44px] px-3 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center justify-center border-b-2 ${
                    active
                      ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                      : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <span>{carrier.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* USSD Dial Codes */}
        <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {activeCarrier.name} Essential USSD Codes
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Tap Dial on Android
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {activeCarrier.ussdCodes.map((item) => {
              const telHref = `tel:${item.code.replace(/#/g, '%23')}`;
              return (
                <div
                  key={item.id}
                  className="py-3.5 first:pt-1 last:pb-1 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {item.label}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {item.note}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono-num text-sm font-bold text-slate-800 dark:text-slate-200 px-2">
                      {item.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => void handleCopyCode(item.code, item.label)}
                      aria-label={`Copy ${item.label} code ${item.code}`}
                      className="min-h-[44px] min-w-[44px] rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <a
                      href={telHref}
                      aria-label={`Dial ${item.label} ${item.code}`}
                      className="min-h-[44px] px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Dial
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Popular Package Presets */}
        <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {activeCarrier.name} Package Load Estimates
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              At {taxRate.toFixed(2)}% tax
            </span>
          </div>

          <div className="space-y-3">
            {activeCarrier.packages.map((pkg) => {
              const calc = calculateRequiredLoad(pkg.targetPrice, taxRate);
              return (
                <div
                  key={pkg.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {pkg.name}
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <span>{pkg.validity}</span>
                      <span aria-hidden="true">·</span>
                      <span>{pkg.summary}</span>
                    </div>
                    <div className="font-mono-num text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Balance needed: {formatPkr(pkg.targetPrice, 0)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-700/60">
                    <div className="text-left sm:text-right">
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Load Required
                      </div>
                      <div className="font-mono-num text-base font-extrabold text-emerald-700 dark:text-emerald-400">
                        {formatPkr(calc.recommendedLoad, 0)}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onUsePackageInCalculator(pkg.targetPrice, activeCarrier.id)}
                      className="min-h-[44px] px-3.5 rounded-xl bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
                    >
                      Calculate Load
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
