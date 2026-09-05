import React from 'react';

export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, actions }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 mb-6 border-b border-subtle">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-txt-primary">{title}</h1>
        {description && <p className="text-xs sm:text-sm text-txt-muted mt-1">{description}</p>}
      </div>
      {actions && <div className="flex items-center space-x-3">{actions}</div>}
    </div>
  );
};
