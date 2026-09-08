import React, { useState, useEffect, useCallback } from 'react';
import { WheelEntry, WheelThemeId } from '../types';
import { DEFAULT_ENTRIES } from '../data/themes';
import { WheelCanvas } from '../components/WheelCanvas';
import { EntriesManager } from '../components/EntriesManager';
import { ThemeSelector } from '../components/ThemeSelector';
import { WinnerModal } from '../components/WinnerModal';
import { ResultBanner } from '../components/ResultBanner';
import { AdSlot } from '../components/AdSlot';
import { getSecureRandomIndex } from '../utils/cryptoRandom';
import { useToast } from '../context/ToastContext';
import { Play, Sparkles, HelpCircle, ShieldCheck, Dices, Award } from 'lucide-react';

const STORAGE_ENTRIES_KEY = 'wheel_spinner_custom_entries';
const STORAGE_THEME_KEY = 'wheel_spinner_theme_id';

interface WheelPageProps {
  soundEnabled: boolean;
}

export const WheelPage: React.FC<WheelPageProps> = ({ soundEnabled }) => {
  const { showToast } = useToast();

  // 1. Entries State with LocalStorage Persistence
  const [entries, setEntries] = useState<WheelEntry[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_ENTRIES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore parse error and load default
    }
    return DEFAULT_ENTRIES.map((text, idx) => ({
      id: `entry-${Date.now()}-${idx}`,
      text,
    }));
  });

  // 2. Theme State with LocalStorage Persistence
  const [themeId, setThemeId] = useState<WheelThemeId>(() => {
    if (typeof window === 'undefined') return 'vibrant';
    try {
      const saved = localStorage.getItem(STORAGE_THEME_KEY);
      if (saved && ['vibrant', 'pastel', 'neon', 'ocean', 'minimal'].includes(saved)) {
        return saved as WheelThemeId;
      }
    } catch {
      // fallback
    }
    return 'vibrant';
  });

  // 3. Spinning & Winner State
  const [isSpinning, setIsSpinning] = useState(false);
  const [targetWinner, setTargetWinner] = useState<WheelEntry | null>(null);
  const [targetWinnerIndex, setTargetWinnerIndex] = useState<number | null>(null);
  const [latestWinner, setLatestWinner] = useState<WheelEntry | null>(null);
  const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);

  // Sync entries to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ENTRIES_KEY, JSON.stringify(entries));
    } catch {
      // Quota or disabled localStorage safe handling
    }
  }, [entries]);

  // Sync theme to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_THEME_KEY, themeId);
    } catch {
      // Safe
    }
  }, [themeId]);

  // Set document title & description
  useEffect(() => {
    document.title = 'Wheel Spinner - Free Online Random Decision Wheel';
  }, []);

  // Entries Management
  const handleAddEntry = (text: string) => {
    const newEntry: WheelEntry = {
      id: `entry-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      text,
    };
    setEntries((prev) => [...prev, newEntry]);
    showToast(`Added "${text}"`, 'info', 1800);
  };

  const handleUpdateEntry = (id: string, newText: string) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, text: newText } : entry))
    );
  };

  const handleDeleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const handleClearAll = () => {
    setEntries([]);
    setLatestWinner(null);
    setTargetWinner(null);
    setTargetWinnerIndex(null);
    showToast('All entries cleared', 'info', 2000);
  };

  const handleShuffle = () => {
    if (entries.length < 2) return;
    // Fisher-Yates shuffle using crypto random
    const shuffled = [...entries];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = getSecureRandomIndex(i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setEntries(shuffled);
    showToast('Entries shuffled!', 'info', 1500);
  };

  const handleLoadPreset = (items: string[]) => {
    const newEntries: WheelEntry[] = items.map((text, idx) => ({
      id: `entry-${Date.now()}-${idx}`,
      text,
    }));
    setEntries(newEntries);
    showToast(`Loaded ${items.length} items preset`, 'success', 2000);
  };

  // Winner selection strictly BEFORE the animation starts
  const handleStartSpin = useCallback(() => {
    if (isSpinning || entries.length < 2) return;

    // 1. Pick winner using window.crypto.getRandomValues BEFORE animation begins
    const selectedIndex = getSecureRandomIndex(entries.length);
    const selectedWinner = entries[selectedIndex];

    setTargetWinner(selectedWinner);
    setTargetWinnerIndex(selectedIndex);
    setIsSpinning(true);
  }, [isSpinning, entries]);

  const handleSpinComplete = useCallback((winner: WheelEntry) => {
    setIsSpinning(false);
    setLatestWinner(winner);
    setIsWinnerModalOpen(true);
  }, []);

  const handleReset = () => {
    setLatestWinner(null);
    setTargetWinner(null);
    setTargetWinnerIndex(null);
    setIsWinnerModalOpen(false);
    showToast('Wheel reset', 'info', 1500);
  };

  const handleSpinAgain = () => {
    setIsWinnerModalOpen(false);
    // Short delay to allow modal dismiss animation
    setTimeout(() => {
      handleStartSpin();
    }, 250);
  };

  const canSpin = entries.length >= 2 && !isSpinning;

  return (
    <div id="wheel-spinner-page" className="w-full">
      {/* Top Hero / Intro */}
      <section className="text-center py-6 sm:py-8 max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>100% Cryptographic Random Selection</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
          Wheel Spinner
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Spin the wheel to make fair random decisions, pick contest winners, select names, or choose activities.
        </p>
      </section>

      {/* Main Interactive Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* AdSlot Placeholder - Placed above or around, non-intrusive */}
        <AdSlot id="ad-slot-top" slotId="9823471012" format="horizontal" />

        {/* Latest Result Banner (If a spin has completed) */}
        {latestWinner && (
          <div className="mb-6">
            <ResultBanner
              winner={latestWinner}
              onSpinAgain={handleStartSpin}
              onReset={handleReset}
              disabled={!canSpin}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Interactive Wheel (Lg: 7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            {/* The Wheel */}
            <WheelCanvas
              entries={entries}
              themeId={themeId}
              isSpinning={isSpinning}
              soundEnabled={soundEnabled}
              onSpinStart={handleStartSpin}
              onSpinComplete={handleSpinComplete}
              targetWinner={targetWinner}
              targetWinnerIndex={targetWinnerIndex}
            />

            {/* Primary Spin Button */}
            <div className="w-full max-w-xs mt-3 flex flex-col items-center">
              <button
                id="main-spin-btn"
                type="button"
                onClick={handleStartSpin}
                disabled={!canSpin}
                aria-label={isSpinning ? 'Wheel is spinning' : 'Spin the wheel'}
                className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-base shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>{isSpinning ? 'Spinning...' : 'Spin the Wheel'}</span>
              </button>

              {entries.length < 2 && (
                <p id="spin-warning-label" className="text-xs text-amber-600 dark:text-amber-400 mt-2 text-center font-medium">
                  Add at least 2 entries to enable spinning
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Controls, Entries, & Theme (Lg: 5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Theme Selector */}
            <ThemeSelector currentTheme={themeId} onSelectTheme={setThemeId} />

            {/* Entries List & Controls */}
            <EntriesManager
              entries={entries}
              themeId={themeId}
              onAddEntry={handleAddEntry}
              onUpdateEntry={handleUpdateEntry}
              onDeleteEntry={handleDeleteEntry}
              onClearAll={handleClearAll}
              onShuffle={handleShuffle}
              onLoadPreset={handleLoadPreset}
              disabled={isSpinning}
            />
          </div>
        </div>

        {/* AdSlot Placeholder - Placed below wheel/controls */}
        <AdSlot id="ad-slot-bottom" slotId="5401928374" format="horizontal" />

        {/* Informational SEO & User Guide Section */}
        <section className="mt-12 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="max-w-3xl">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
              How Does the Wheel Spinner Work?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                  Cryptographically Fair
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Winners are chosen using <code className="text-[11px] bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">window.crypto.getRandomValues</code> with zero modulo bias, giving every entry mathematically equal probability.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Dices className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                  Predetermined Physics
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  The winner is securely chosen before the wheel begins to spin, guaranteeing the animation lands strictly and smoothly on the true winner every time.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                  Private & Persistent
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Your custom entries and selected theme are saved automatically in your browser’s localStorage. No tracking, no login, and no server databases.
                </p>
              </div>
            </div>

            {/* Common Use Cases */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-500" />
                Popular Uses for Wheel Spinner
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                Whether you need to pick a lucky raffle winner, choose who takes the next turn in classroom trivia, decide on tonight’s dinner, or resolve a friendly debate, Wheel Spinner makes spontaneous decisions transparent, engaging, and 100% fair.
              </p>
            </div>
          </div>
        </section>
      </section>

      {/* Celebratory Winner Modal */}
      <WinnerModal
        winner={latestWinner}
        isOpen={isWinnerModalOpen}
        onClose={() => setIsWinnerModalOpen(false)}
        onSpinAgain={handleSpinAgain}
        onReset={handleReset}
      />
    </div>
  );
};
