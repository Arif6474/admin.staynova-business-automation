import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme.js';
import { Button } from '../ui/Button.js';

export const AuthLayout: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-app flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-200">
      {/* Theme toggle button in auth screen top right */}
      <div className="absolute top-6 right-6 z-20">
        <Button
          variant="secondary"
          size="icon"
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="rounded-xl shadow-md border-subtle"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-[#dfa745]" />
          ) : (
            <Moon className="w-4 h-4 text-[#b0821d]" />
          )}
        </Button>
      </div>

      {/* Background glowing gradients */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-brand-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Focused Luxury Card Container */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 z-10">
        <div className="glass-panel bg-card/95 py-10 px-7 sm:px-10 shadow-2xl rounded-3xl border border-subtle">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
