import React from 'react';
import { WheelThemeId } from '../types';
import { WHEEL_THEMES } from '../data/themes';
import { Palette, Check } from 'lucide-react';

interface ThemeSelectorProps {
  currentTheme: WheelThemeId;
  onSelectTheme: (themeId: WheelThemeId) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onSelectTheme }) => {
  const themeEntries = Object.values(WHEEL_THEMES);

  return (
    <div id="theme-selector-card" className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-indigo-500" />
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Wheel Theme
          </h2>
        </div>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 capitalize">
          {WHEEL_THEMES[currentTheme]?.name}
        </span>
      </div>

      {/* Theme buttons grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {themeEntries.map((theme) => {
          const isSelected = currentTheme === theme.id;
          return (
            <button
              key={theme.id}
              id={`theme-btn-${theme.id}`}
              type="button"
              onClick={() => onSelectTheme(theme.id)}
              className={`group relative flex flex-col p-2.5 rounded-xl border text-left transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                isSelected
                  ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-950/40'
              }`}
              aria-label={`Select ${theme.name} theme`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {theme.name}
                </span>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                )}
              </div>

              {/* Color dots preview */}
              <div className="flex items-center gap-1 overflow-hidden">
                {theme.colors.slice(0, 4).map((c, i) => (
                  <span
                    key={i}
                    className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
