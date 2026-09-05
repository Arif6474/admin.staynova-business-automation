import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Bell, LogOut, Sun, Moon, User, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { useTheme } from '../../hooks/useTheme.js';
import { Button } from '../ui/Button.js';

export interface TopbarProps {
  onToggleSidebar: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onToggleSidebar,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  // Get current active title from route pathname
  const path = location.pathname.replace('/', '') || 'dashboard';
  const pageTitle = path.replace('-', ' ').toUpperCase();

  return (
    <header className="h-16 px-4 lg:px-8 border-b border-subtle bg-topbar backdrop-blur-md flex items-center justify-between sticky top-0 z-30 transition-colors duration-200">
      {/* Left: Mobile Toggle / Desktop Collapse Toggle & Page Title */}
      <div className="flex items-center space-x-3">
        {/* Mobile Drawer Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden rounded-xl text-txt-secondary hover:text-txt-primary"
          onClick={onToggleSidebar}
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Desktop Collapse / Expand Quick Toggle */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            className="hidden lg:flex w-8 h-8 rounded-xl items-center justify-center text-txt-dimmed hover:text-txt-primary hover:bg-muted/80 transition-colors"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-brand-500" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        )}

        <div className="h-4 w-px bg-subtle hidden lg:block" />

        <h2 className="text-xs sm:text-sm font-bold tracking-widest text-txt-primary uppercase font-mono">
          {pageTitle}
        </h2>
      </div>

      {/* Right: Theme Toggle, Notifications & Luxury User Pill */}
      <div className="flex items-center space-x-2.5 sm:space-x-3">
        {/* Dark / Light Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="text-txt-muted hover:text-txt-primary rounded-xl"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-[#dfa745] transition-transform duration-300 rotate-0 hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 text-[#b0821d] transition-transform duration-300 -rotate-12 hover:rotate-0" />
          )}
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-txt-muted hover:text-txt-primary rounded-xl"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-topbar" />
        </Button>

        {/* User Pill Badge */}
        <div className="flex items-center space-x-2.5 pl-2 sm:pl-3 border-l border-subtle">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-muted border border-subtle hover:border-brand-500/30 transition-colors">
            <div className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-500 flex items-center justify-center border border-brand-500/30">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold text-txt-primary tracking-wide">
              {user?.role || 'Super Admin'}
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            title="Log Out"
            className="text-txt-muted hover:text-status-danger rounded-xl"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
