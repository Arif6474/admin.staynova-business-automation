import React, { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn.js';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  glass = true,
  ...props
}) => {
  return (
    <div
      className={cn(
        'rounded-xl p-5 border transition-all duration-200',
        glass
          ? 'glass-card border-subtle'
          : 'bg-card border-subtle shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
