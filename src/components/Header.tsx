import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useThemeMode } from '../context/ThemeModeContext';
import { PageRoute } from '../types';
import { Sun, Moon, Volume2, VolumeX, Menu, X, Disc } from 'lucide-react';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({ soundEnabled, onToggleSound }) => {
  const { currentPath, navigate } = useRouter();
  const { mode, toggleMode } = useThemeMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (route: PageRoute) => {
    navigate(route);
    setMobileMenuOpen(false);
  };

  const navLinks: { label: string; route: PageRoute }[] = [
    { label: 'Wheel Spinner', route: '/wheel-spinner' },
    { label: 'Privacy Policy', route: '/privacy-policy' },
    { label: 'Terms', route: '/terms' },
    { label: 'Contact', route: '/contact' },
  ];

  return (
    <header
      id="site-header"
      className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md transition-colors"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo / Brand */}
        <button
          id="brand-logo-btn"
          onClick={() => handleNav('/')}
          className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1"
          aria-label="Wheel Spinner Homepage"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Disc className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              Wheel Spinner
            </span>
          </div>
        </button>

        {/* Desktop Nav */}
        <nav id="desktop-navigation" aria-label="Main Navigation" className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = currentPath === link.route || (link.route === '/wheel-spinner' && currentPath === '/');
            return (
              <button
                key={link.route}
                id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => handleNav(link.route)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Actions (Sound, Theme, Mobile Toggle) */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle Button */}
          <button
            id="sound-toggle-btn"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute wheel sound' : 'Enable wheel sound'}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            title={soundEnabled ? 'Sound enabled' : 'Sound muted'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            )}
          </button>

          {/* Dark / Light Toggle */}
          <button
            id="theme-mode-toggle-btn"
            onClick={toggleMode}
            aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
          >
            {mode === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-menu-drawer" className="md:hidden border-t border-slate-200 dark:border-slate-800 px-4 py-3 bg-white dark:bg-slate-950 flex flex-col gap-1.5 shadow-lg">
          {navLinks.map((link) => {
            const isActive = currentPath === link.route || (link.route === '/wheel-spinner' && currentPath === '/');
            return (
              <button
                key={link.route}
                id={`mobile-nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => handleNav(link.route)}
                className={`text-left px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 font-semibold'
                    : 'text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
