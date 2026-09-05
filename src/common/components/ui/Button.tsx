import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/cn.js';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-app disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    // Luxury StayNova Gold Button
    primary:
      'bg-gradient-to-r from-[#dfa745] to-[#c59232] hover:from-[#e7b457] hover:to-[#ce9b3b] text-slate-950 font-bold shadow-lg shadow-[#dfa745]/20 focus:ring-brand-500 active:scale-[0.98]',
    // Translucent Luxury Navy Secondary Button
    secondary:
      'bg-surface/80 hover:bg-muted text-txt-primary border border-subtle hover:border-brand-500/30 focus:ring-brand-500 active:scale-[0.98]',
    outline:
      'border border-border-default hover:border-brand-500/40 hover:bg-muted/60 text-txt-secondary focus:ring-brand-500 active:scale-[0.98]',
    danger:
      'bg-status-danger hover:opacity-90 text-white shadow-md shadow-red-500/20 focus:ring-status-danger active:scale-[0.98]',
    ghost:
      'hover:bg-muted text-txt-muted hover:text-txt-primary focus:ring-brand-500',
    success:
      'bg-status-success hover:opacity-90 text-white shadow-md shadow-emerald-500/20 focus:ring-status-success active:scale-[0.98]',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-2.5 gap-2.5',
    icon: 'p-2 aspect-square',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
      {children}
    </button>
  );
};
