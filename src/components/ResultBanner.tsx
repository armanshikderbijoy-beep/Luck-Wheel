import React, { useState } from 'react';
import { WheelEntry } from '../types';
import { useToast } from '../context/ToastContext';
import { Trophy, RotateCw, RefreshCw, Copy, Share2, Check } from 'lucide-react';

interface ResultBannerProps {
  winner: WheelEntry | null;
  onSpinAgain: () => void;
  onReset: () => void;
  disabled?: boolean;
}

export const ResultBanner: React.FC<ResultBannerProps> = ({
  winner,
  onSpinAgain,
  onReset,
  disabled = false,
}) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!winner) return null;

  const resultText = `Winner: ${winner.text}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resultText);
      setCopied(true);
      showToast('Result copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Failed to copy result', 'warning');
    }
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Wheel Spinner Result',
          text: `🎉 The Wheel Spinner decided: ${winner.text}!`,
          url: window.location.href,
        });
      } catch (err: unknown) {
        if ((err as Error)?.name !== 'AbortError') {
          await fallbackCopy();
        }
      }
    } else {
      await fallbackCopy();
    }
  };

  const fallbackCopy = async () => {
    try {
      await navigator.clipboard.writeText(resultText);
      showToast('Sharing is unavailable in this browser. Result copied to clipboard instead!', 'info', 4000);
    } catch {
      showToast('Sharing is unavailable and clipboard copy failed.', 'warning');
    }
  };

  return (
    <div
      id="latest-result-card"
      className="w-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-pink-950/40 border border-indigo-200 dark:border-indigo-900/60 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all"
    >
      <div className="flex items-center gap-3.5 text-center sm:text-left">
        <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/30">
          <Trophy className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400">
            Latest Result
          </span>
          <p id="winner-display-text" className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Winner: <span className="text-indigo-600 dark:text-indigo-400">{winner.text}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          id="banner-spin-again-btn"
          type="button"
          onClick={onSpinAgain}
          disabled={disabled}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-40"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Spin Again</span>
        </button>

        <button
          id="banner-reset-btn"
          type="button"
          onClick={onReset}
          disabled={disabled}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors disabled:opacity-40"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>

        <button
          id="banner-copy-btn"
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
          title="Copy result"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>

        <button
          id="banner-share-btn"
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
          title="Share result"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};
