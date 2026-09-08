import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { WheelEntry } from '../types';
import { useToast } from '../context/ToastContext';
import { Trophy, RotateCw, RefreshCw, Copy, Share2, X, Check } from 'lucide-react';

interface WinnerModalProps {
  winner: WheelEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onSpinAgain: () => void;
  onReset: () => void;
}

export const WinnerModal: React.FC<WinnerModalProps> = ({
  winner,
  isOpen,
  onClose,
  onSpinAgain,
  onReset,
}) => {
  const { showToast } = useToast();
  const [copied, setCopied] = React.useState(false);

  // Trigger confetti burst on open
  useEffect(() => {
    if (isOpen && winner) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'],
        });
      } catch {
        // Safe fallback if confetti canvas fails
      }
    }
    setCopied(false);
  }, [isOpen, winner]);

  if (!isOpen || !winner) return null;

  const resultText = `Winner: ${winner.text}`;

  // Copy result to clipboard
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

  // Share result or fallback to copy + toast
  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Wheel Spinner Result',
          text: `🎉 The Wheel Spinner decided: ${winner.text}! Try it here: https://wheelspinner.app`,
          url: window.location.href,
        });
      } catch (err: unknown) {
        // If user cancelled, don't toast error
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
      id="winner-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="winner-dialog-title"
    >
      <div
        id="winner-modal-card"
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl text-center transform transition-all animate-in zoom-in-95 duration-200"
      >
        {/* Close button */}
        <button
          id="close-winner-modal-btn"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Trophy icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/25 animate-bounce">
          <Trophy className="w-9 h-9" />
        </div>

        {/* Subtitle */}
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-1">
          Decision Made
        </p>

        {/* Required Winner Display */}
        <h2
          id="winner-dialog-title"
          className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 break-words"
        >
          Winner: <span className="text-indigo-600 dark:text-indigo-400 underline decoration-indigo-300 dark:decoration-indigo-700 underline-offset-4">{winner.text}</span>
        </h2>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* Spin Again */}
          <button
            id="modal-spin-again-btn"
            type="button"
            onClick={onSpinAgain}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold text-sm shadow-md shadow-indigo-500/25 transition-all"
          >
            <RotateCw className="w-4 h-4" />
            <span>Spin Again</span>
          </button>

          {/* Reset */}
          <button
            id="modal-reset-btn"
            type="button"
            onClick={onReset}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Copy Result */}
          <button
            id="modal-copy-result-btn"
            type="button"
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-xs font-medium transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Result'}</span>
          </button>

          {/* Share Result */}
          <button
            id="modal-share-result-btn"
            type="button"
            onClick={handleShare}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-xs font-medium transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Result</span>
          </button>
        </div>
      </div>
    </div>
  );
};
