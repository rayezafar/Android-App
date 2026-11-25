import React from 'react';
import { Download, Moon, Sun } from 'lucide-react';

export type AppTab = 'calculator' | 'ussd' | 'history' | 'apk';

interface HeaderProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  isInstallable: boolean;
  isInstalled: boolean;
  onInstall: () => void;
}

const NAV_ITEMS: { id: AppTab; label: string }[] = [
  { id: 'calculator', label: 'Calculator' },
  { id: 'ussd', label: 'Packages & USSD' },
  { id: 'history', label: 'History' },
  { id: 'apk', label: 'Android APK' },
];

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  isDark,
  onToggleTheme,
  isInstallable,
  isInstalled,
  onInstall,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      {/* Desktop 3-Zone Top Bar */}
      <div className="hidden md:flex items-center justify-between gap-8 max-w-6xl mx-auto px-6 h-16">
        <button
          type="button"
          onClick={() => onTabChange('calculator')}
          className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg px-1"
        >
          PakLoad
        </button>

        <nav aria-label="Main navigation" className="flex items-center gap-6">
          {NAV_ITEMS.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                aria-current={active ? 'page' : undefined}
                className={`py-2 text-sm font-semibold whitespace-nowrap shrink-0 border-b-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  active
                    ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 dark:border-emerald-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {isInstallable && !isInstalled ? (
            <button
              type="button"
              onClick={onInstall}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold whitespace-nowrap shrink-0 flex items-center gap-2 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              Install App
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onTabChange('apk')}
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white text-xs font-semibold whitespace-nowrap shrink-0 transition-colors"
            >
              Get Android App
            </button>
          )}
        </div>
      </div>

      {/* Mobile Compact Top App Bar (52px <= 15% cap with 58px bottom nav) */}
      <div className="flex md:hidden items-center justify-between px-4 h-[52px]">
        <button
          type="button"
          onClick={() => onTabChange('calculator')}
          className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0"
        >
          PakLoad
        </button>

        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate px-2">
          {NAV_ITEMS.find((i) => i.id === activeTab)?.label}
        </span>

        <div className="flex items-center gap-1 shrink-0">
          {isInstallable && !isInstalled && (
            <button
              type="button"
              onClick={onInstall}
              aria-label="Install Android App"
              className="min-h-[44px] px-2.5 flex items-center gap-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              Install
            </button>
          )}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
