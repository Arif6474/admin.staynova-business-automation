import React from 'react';
import { cn } from '../../utils/cn.js';

export interface TabItem {
  id: string;
  label: string;
  badge?: number | string;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className }) => {
  return (
    <div className={cn('flex items-center space-x-1 border-b border-subtle pb-px', className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium transition-all relative rounded-t-lg -mb-px flex items-center space-x-2',
              isActive
                ? 'text-brand-600 dark:text-brand-400 border-b-2 border-brand-500 bg-brand-500/10'
                : 'text-txt-muted hover:text-txt-primary hover:bg-muted/60'
            )}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  'px-2 py-0.5 text-xs rounded-full font-semibold',
                  isActive ? 'bg-brand-500/20 text-brand-600 dark:text-brand-300' : 'bg-muted text-txt-muted'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
