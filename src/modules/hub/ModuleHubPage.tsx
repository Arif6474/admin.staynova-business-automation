import React from 'react';
import { Link } from 'react-router-dom';
import { NavGroup } from '../../config/navigation.js';
import { usePermission } from '../../common/hooks/usePermission.js';
import { LucideIcon } from 'lucide-react';

export interface ModuleHubPageProps {
  group: NavGroup;
  title?: string;
  description?: string;
}

// Curated modern color accents for the Hub cards matching reference screenshots
const cardThemes = [
  {
    iconBg: 'bg-cyan-950/40 border-cyan-500/30 text-cyan-400 group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]',
    tag: 'Cyan',
  },
  {
    iconBg: 'bg-purple-950/40 border-purple-500/30 text-purple-400 group-hover:border-purple-400 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]',
    tag: 'Purple',
  },
  {
    iconBg: 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400 group-hover:border-emerald-400 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]',
    tag: 'Emerald',
  },
  {
    iconBg: 'bg-amber-950/40 border-amber-500/30 text-amber-400 group-hover:border-amber-400 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]',
    tag: 'Amber',
  },
  {
    iconBg: 'bg-rose-950/40 border-rose-500/30 text-rose-400 group-hover:border-rose-400 group-hover:shadow-[0_0_20px_rgba(244,63,94,0.2)]',
    tag: 'Rose',
  },
  {
    iconBg: 'bg-blue-950/40 border-blue-500/30 text-blue-400 group-hover:border-blue-400 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]',
    tag: 'Blue',
  },
  {
    iconBg: 'bg-indigo-950/40 border-indigo-500/30 text-indigo-400 group-hover:border-indigo-400 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]',
    tag: 'Indigo',
  },
  {
    iconBg: 'bg-teal-950/40 border-teal-500/30 text-teal-400 group-hover:border-teal-400 group-hover:shadow-[0_0_20px_rgba(20,184,166,0.2)]',
    tag: 'Teal',
  },
];

export const ModuleHubPage: React.FC<ModuleHubPageProps> = ({
  group,
  title,
  description,
}) => {
  const { hasPermission, isSuperAdmin } = usePermission();

  const filteredItems = group.items.filter(
    (item) => !item.module || isSuperAdmin || hasPermission(item.module, 'view')
  );

  const hubTitle = title || `${group.groupTitle} Hub`;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-txt-primary tracking-tight font-sans">
          {hubTitle}
        </h1>
        {description && (
          <p className="text-sm text-txt-muted mt-1.5">{description}</p>
        )}
      </div>

      {/* Grid of Module Cards matching Reference Screenshots */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item, idx) => {
          const Icon = item.icon as LucideIcon;
          const theme = cardThemes[idx % cardThemes.length];

          return (
            <Link
              key={item.href}
              to={item.href}
              className="bg-card border border-white/[0.035] rounded-3xl p-6 hover:border-white/[0.08] hover:bg-card-hover hover:scale-[1.01] transition-all duration-200 cursor-pointer flex flex-col justify-between group min-h-[160px] shadow-xs"
            >
              {/* Top: Icon Badge Container */}
              <div className="flex items-start justify-between">
                <div
                  className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all duration-200 ${theme.iconBg}`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-brand-500/20 text-brand-500 border border-brand-500/30 font-mono">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Bottom: Title & Subtitle */}
              <div className="mt-6">
                <h3 className="text-base font-bold text-txt-primary group-hover:text-brand-500 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-txt-muted mt-1">
                  Open the {item.title} module
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
