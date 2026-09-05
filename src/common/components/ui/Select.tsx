import { forwardRef, SelectHTMLAttributes } from 'react';
import { cn } from '../../utils/cn.js';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ label: string; value: string | number }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label className="block text-xs font-semibold text-txt-secondary uppercase tracking-wider">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full rounded-xl bg-input border text-txt-primary text-sm px-3.5 py-2.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 shadow-inner',
            error
              ? 'border-status-danger focus:ring-status-danger/30 focus:border-status-danger'
              : 'border-default hover:border-brand-500/40',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-surface text-txt-primary">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-status-danger mt-1 font-medium">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
