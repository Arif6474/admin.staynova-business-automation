import React from 'react';
import { cn } from '../../utils/cn.js';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className,
}) => {
  const variants = {
    primary: 'bg-brand-500/15 text-brand-600 dark:text-brand-400 border-brand-500/30',
    success: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    danger: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
    neutral: 'bg-muted text-txt-secondary border-subtle',
    info: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 leading-none font-semibold',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border tracking-wide uppercase',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};
