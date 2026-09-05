import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Plus,
  Minus,
  PanelLeftOpen,
  LogOut,
  LayoutGrid,
  X,
} from 'lucide-react';
import { navigationConfig } from '../../../config/navigation.js';
import { usePermission } from '../../hooks/usePermission.js';
import { useAuth } from '../../hooks/useAuth.js';
import { cn } from '../../utils/cn.js';

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasPermission, isSuperAdmin } = usePermission();
  const { user, logout } = useAuth();

  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const effectiveCollapsed = isCollapsed && !isMobile;

  // Track expanded groups in accordion (Expanded mode)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    navigationConfig.forEach((group) => {
      const hasActiveChild =
        location.pathname === group.hubHref ||
        group.items.some(
          (item) => location.pathname === item.href || location.pathname.startsWith(item.href + '/')
        );
      initial[group.id] = hasActiveChild || group.id === 'workforce' || group.id === 'overview';
    });
    return initial;
  });

  useEffect(() => {
    navigationConfig.forEach((group) => {
      const hasActiveChild =
        location.pathname === group.hubHref ||
        group.items.some(
          (item) => location.pathname === item.href || location.pathname.startsWith(item.href + '/')
        );
      if (hasActiveChild) {
        setExpandedGroups((prev) => ({ ...prev, [group.id]: true }));
      }
    });
  }, [location.pathname]);

  const toggleGroup = (groupId: string) => {
    if (effectiveCollapsed) {
      onToggleCollapse();
      setExpandedGroups((prev) => ({ ...prev, [groupId]: true }));
      return;
    }
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Main Sidebar Aside */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 bg-sidebar border-r border-subtle flex flex-col transition-all duration-300 ease-in-out select-none',
          // Desktop sizing & overflow behavior
          effectiveCollapsed ? 'lg:w-20 overflow-visible' : 'lg:w-64 overflow-hidden',
          // Mobile open/close drawer
          isOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* =========================================================
            1. SIDEBAR HEADER (Brand Logo & Collapse Toggle)
           ========================================================= */}
        <div
          className={cn(
            'h-20 flex items-center border-b border-subtle transition-all duration-300 shrink-0',
            effectiveCollapsed ? 'justify-center px-0' : 'justify-between px-5'
          )}
        >
          {/* Logo & Brand Title */}
          <div
            onClick={() => {
              if (effectiveCollapsed) onToggleCollapse();
              else navigate('/dashboard');
            }}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            {/* StayNova Luxury Gold Monogram */}
            <div className="w-11 h-11 shrink-0 rounded-2xl bg-gradient-to-br from-[#dfa745] to-[#9e7120] flex items-center justify-center shadow-md shadow-[#dfa745]/20 border border-[#f4e3ba]/25 group-hover:scale-105 transition-transform duration-200">
              <span className="font-serif font-black text-slate-950 text-base tracking-tighter">
                SN
              </span>
            </div>

            {/* Brand Title (hidden when collapsed) */}
            {!effectiveCollapsed && (
              <div className="flex flex-col overflow-hidden transition-all duration-300">
                <h1 className="font-bold text-base tracking-tight text-txt-primary font-sans">
                  StayNova
                </h1>
              </div>
            )}
          </div>

          {/* Mobile Close Button */}
          {!effectiveCollapsed && isMobile && (
            <button
              onClick={onClose}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-xl bg-surface/50 border border-subtle text-txt-secondary hover:text-txt-primary hover:bg-muted/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* =========================================================
            2. NAVIGATION MENU (Smooth Accordion & Collapsed Flyouts)
           ========================================================= */}
        <div
          className={cn(
            'flex-1 px-3 py-4 space-y-2.5',
            effectiveCollapsed
              ? 'overflow-visible'
              : 'overflow-y-auto overflow-x-hidden custom-scrollbar'
          )}
        >
          {navigationConfig.map((group) => {
            const filteredItems = group.items.filter(
              (item) => !item.module || isSuperAdmin || hasPermission(item.module, 'view')
            );

            if (filteredItems.length === 0) return null;

            const isGroupActive =
              location.pathname === group.hubHref ||
              filteredItems.some(
                (item) =>
                  location.pathname === item.href || location.pathname.startsWith(item.href + '/')
              );
            const isExpanded = !!expandedGroups[group.id];
            const GroupIcon = group.icon;

            // --- COLLAPSED MODE (Exact Match to Reference Screenshot) ---
            if (effectiveCollapsed) {
              if (filteredItems.length === 1 && group.id === 'overview') {
                const singleItem = filteredItems[0];
                const ItemIcon = singleItem.icon;
                const isActive =
                  location.pathname === singleItem.href ||
                  location.pathname.startsWith(singleItem.href + '/');

                return (
                  <div key={group.id} className="flex justify-center relative group/flyout">
                    <NavLink
                      to={singleItem.href}
                      onClick={() => onClose()}
                      className={cn(
                        'w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200',
                        isActive
                          ? 'border border-brand-500 bg-brand-500/15 text-brand-500 shadow-[0_0_15px_rgba(223,167,69,0.25)]'
                          : 'text-txt-dimmed hover:text-txt-primary hover:bg-muted/60'
                      )}
                    >
                      <ItemIcon className="w-5 h-5" />
                    </NavLink>

                    {/* Floating Tooltip */}
                    <div className="absolute left-full top-2 pl-3 opacity-0 translate-x-2 pointer-events-none group-hover/flyout:opacity-100 group-hover/flyout:translate-x-0 group-hover/flyout:pointer-events-auto transition-all duration-200 z-50">
                      <div className="px-3 py-1.5 rounded-xl bg-surface/95 backdrop-blur-md border border-subtle text-xs font-semibold text-txt-primary whitespace-nowrap shadow-xl">
                        {singleItem.title}
                      </div>
                    </div>
                  </div>
                );
              }

              // Multi-item group in collapsed mode with Floating Flyout Menu
              return (
                <div key={group.id} className="flex justify-center relative group/flyout">
                  <NavLink
                    to={group.hubHref || filteredItems[0].href}
                    className={cn(
                      'w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 relative',
                      isGroupActive
                        ? 'border border-brand-500 bg-brand-500/15 text-brand-500 shadow-[0_0_15px_rgba(223,167,69,0.25)]'
                        : 'text-txt-dimmed hover:text-txt-primary hover:bg-muted/60'
                    )}
                  >
                    <GroupIcon className="w-5 h-5" />
                  </NavLink>

                  {/* Sleek Floating Flyout Popup Menu matching Screenshot */}
                  <div className="absolute left-full top-0 pl-3 min-w-[252px] opacity-0 translate-x-2 pointer-events-none group-hover/flyout:opacity-100 group-hover/flyout:translate-x-0 group-hover/flyout:pointer-events-auto transition-all duration-200 z-50">
                    <div className="p-3 rounded-3xl bg-surface/98 backdrop-blur-2xl border border-subtle shadow-2xl space-y-1.5">
                      {/* Flyout Header */}
                      <div className="px-3 py-1 text-[11px] font-bold text-txt-dimmed uppercase tracking-wider font-mono">
                        {group.groupTitle}
                      </div>

                      {/* Flyout Sub-items */}
                      <div className="space-y-0.5">
                        {filteredItems.map((child) => {
                          const ChildIcon = child.icon;
                          const isChildActive = location.pathname === child.href;
                          return (
                            <NavLink
                              key={child.href}
                              to={child.href}
                              onClick={() => onClose()}
                              className={cn(
                                'flex items-center space-x-3 px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-150',
                                isChildActive
                                  ? 'text-brand-500 bg-brand-500/15 font-bold border border-brand-500/30'
                                  : 'text-txt-secondary hover:text-txt-primary hover:bg-muted/70'
                              )}
                            >
                              <ChildIcon className="w-4 h-4 shrink-0 text-txt-dimmed" />
                              <span className="truncate">{child.title}</span>
                            </NavLink>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            // --- EXPANDED MODE (Full Accordion Menu matching Image 2) ---
            if (filteredItems.length === 1 && group.id === 'overview') {
              const singleItem = filteredItems[0];
              const ItemIcon = singleItem.icon;
              const isActive =
                location.pathname === singleItem.href ||
                location.pathname.startsWith(singleItem.href + '/');

              return (
                <div key={group.id} className="space-y-1">
                  <NavLink
                    to={singleItem.href}
                    onClick={() => onClose()}
                    className={cn(
                      'flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all duration-200 group',
                      isActive
                        ? 'border border-brand-500/30 bg-brand-500/10 text-brand-500 font-bold shadow-xs'
                        : 'text-txt-secondary hover:text-txt-primary hover:bg-muted/50'
                    )}
                  >
                    <ItemIcon
                      className={cn(
                        'w-4 h-4 shrink-0 transition-colors',
                        isActive ? 'text-brand-500' : 'text-txt-dimmed group-hover:text-txt-primary'
                      )}
                    />
                    <span className="flex-1 truncate">{singleItem.title}</span>
                  </NavLink>
                </div>
              );
            }

            // Collapsible Group Accordion
            return (
              <div
                key={group.id}
                className={cn(
                  'rounded-2xl transition-all duration-200',
                  isGroupActive
                    ? 'border border-brand-500/20 bg-brand-500/[0.03] p-1'
                    : 'border border-transparent'
                )}
              >
                {/* Accordion Header */}
                <button
                  onClick={() => toggleGroup(group.id)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 group',
                    isGroupActive
                      ? 'text-brand-500'
                      : 'text-txt-secondary hover:text-txt-primary hover:bg-muted/50'
                  )}
                >
                  <div className="flex items-center space-x-3 truncate">
                    <GroupIcon
                      className={cn(
                        'w-4 h-4 shrink-0 transition-colors',
                        isGroupActive
                          ? 'text-brand-500'
                          : 'text-txt-dimmed group-hover:text-txt-primary'
                      )}
                    />
                    <span className="truncate">{group.groupTitle}</span>
                  </div>

                  <div
                    className={cn(
                      'w-5 h-5 rounded-lg flex items-center justify-center transition-colors text-txt-dimmed group-hover:text-txt-primary',
                      isGroupActive && 'text-brand-500'
                    )}
                  >
                    {isExpanded ? (
                      <Minus className="w-3.5 h-3.5 transition-transform duration-200" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 transition-transform duration-200" />
                    )}
                  </div>
                </button>

                {/* Smooth Animated Collapsible Submenu */}
                <div
                  className={cn(
                    'grid transition-all duration-300 ease-in-out',
                    isExpanded ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'
                  )}
                >
                  <div className="overflow-hidden space-y-0.5 pl-3 pr-1 pb-1">
                    {filteredItems.map((item) => {
                      const Icon = item.icon;
                      const isActive =
                        location.pathname === item.href ||
                        location.pathname.startsWith(item.href + '/');

                      return (
                        <NavLink
                          key={item.href}
                          to={item.href}
                          onClick={() => onClose()}
                          className={cn(
                            'flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 group',
                            isActive
                              ? 'text-brand-500 font-bold bg-brand-500/10 border-l-2 border-brand-500'
                              : 'text-txt-muted hover:text-txt-primary hover:bg-muted/40'
                          )}
                        >
                          <Icon
                            className={cn(
                              'w-3.5 h-3.5 shrink-0 transition-colors',
                              isActive
                                ? 'text-brand-500'
                                : 'text-txt-dimmed group-hover:text-txt-secondary'
                            )}
                          />
                          <span className="flex-1 truncate">{item.title}</span>
                          {item.badge && (
                            <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-brand-500/20 text-brand-500 border border-brand-500/30 font-mono">
                              {item.badge}
                            </span>
                          )}
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* =========================================================
            3. SIDEBAR FOOTER (User Session Card matching Image 2)
           ========================================================= */}
        <div className="p-3 border-t border-subtle shrink-0">
          {effectiveCollapsed ? (
            <div className="flex flex-col items-center space-y-2">
              <button
                onClick={onToggleCollapse}
                title="Expand Sidebar"
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-txt-dimmed hover:text-txt-primary hover:bg-muted/60 transition-colors"
              >
                <PanelLeftOpen className="w-4 h-4" />
              </button>

              <div
                className="relative group/avatar cursor-pointer"
                title={`${user?.role || 'Super Admin'} - Active Session`}
              >
                <div className="w-10 h-10 rounded-full bg-brand-500/20 text-brand-500 border border-brand-500/30 flex items-center justify-center font-bold text-xs shadow-xs">
                  {user?.role ? user.role.slice(0, 2).toUpperCase() : 'SA'}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-sidebar" />
              </div>
            </div>
          ) : (
            <div className="bg-surface/50 border border-subtle p-2.5 rounded-2xl flex items-center justify-between shadow-xs">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-xl bg-brand-500/20 text-brand-500 border border-brand-500/30 flex items-center justify-center font-bold text-xs">
                    {user?.role ? user.role.slice(0, 2).toUpperCase() : 'SA'}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-surface" />
                </div>

                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold text-txt-primary truncate">
                    {user?.role || 'Super Admin'}
                  </h4>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] text-txt-muted tracking-tight truncate">
                      Active Session
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={logout}
                title="Log Out"
                className="w-8 h-8 rounded-xl flex items-center justify-center text-txt-dimmed hover:text-status-danger hover:bg-status-danger/10 transition-colors shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
