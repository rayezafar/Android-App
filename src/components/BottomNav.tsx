import React from 'react';
import { Calculator, Clock, PhoneCall, Smartphone } from 'lucide-react';
import type { AppTab } from './Header';

interface BottomNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  historyCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  historyCount,
}) => {
  const tabs: { id: AppTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'calculator', label: 'Calculator', icon: Calculator },
    { id: 'ussd', label: 'USSD & Plans', icon: PhoneCall },
    { id: 'history', label: historyCount > 0 ? `History (${historyCount})` : 'History', icon: Clock },
    { id: 'apk', label: 'APK App', icon: Smartphone },
  ];

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-safe"
    >
      <div className="grid grid-cols-4 h-[58px]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              aria-current={active ? 'page' : undefined}
              className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 px-1 transition-colors duration-150 ${
                active
                  ? 'text-emerald-700 dark:text-emerald-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[11px] leading-tight whitespace-nowrap truncate max-w-full">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
