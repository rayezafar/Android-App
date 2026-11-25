import { useEffect, useRef, useState } from 'react';
import { CalculatorView } from './components/CalculatorView';
import { AppTab, Header } from './components/Header';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Toast } from './components/Toast';
import { useLocalStorage } from './hooks/useLocalStorage';
import { usePWAInstall } from './hooks/usePWAInstall';
import {
  DEFAULT_TAX_RATE,
  HistoryEntry,
} from './utils/calculator';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('calculator');
  const [isDark, setIsDark] = useLocalStorage<boolean>('pakload_dark_mode', false);
  const taxRate = DEFAULT_TAX_RATE;
  const [loadInput, setLoadInput] = useState<string>('320');
  const [requiredInput, setRequiredInput] = useState<string>('270');
  const [, setHistory] = useLocalStorage<HistoryEntry[]>('pakload_history', []);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const { isInstallable, isInstalled, install } = usePWAInstall();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const notify = (msg: string) => {
    setToastMsg(msg);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMsg(null);
    }, 2400);
  };

  const handleSaveEntry = (
    mode: 'load' | 'target',
    inputAmount: number,
    outputAmount: number,
    secondaryAmount: number
  ) => {
    if (inputAmount <= 0) {
      notify('Enter an amount greater than 0 to save');
      return;
    }

    const newEntry: HistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      mode,
      network: 'all',
      taxRatePercent: taxRate,
      inputAmount,
      outputAmount,
      secondaryAmount,
      createdAt: new Date().toISOString(),
    };

    setHistory((prev) => [newEntry, ...prev].slice(0, 30));
    notify('Saved calculation');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
        onInstall={() => {
          void install();
        }}
      />

      <Toast message={toastMsg} />
      <OfflineIndicator />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-5 sm:pt-8 pb-8 sm:pb-10">
        <CalculatorView
          loadInput={loadInput}
          onLoadInputChange={setLoadInput}
          requiredInput={requiredInput}
          onRequiredInputChange={setRequiredInput}
          onSaveEntry={handleSaveEntry}
          onNotify={notify}
        />
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-5 px-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>For estimation purposes. Actual operator deductions or package taxes may vary.</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Designed &amp; Developed by Zafar Iqbal
          </span>
        </div>
      </footer>
    </div>
  );
}
