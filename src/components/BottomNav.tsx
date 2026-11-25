import React from 'react';
import type { AppTab } from './Header';

interface BottomNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = () => {
  return null;
};
