import React from 'react';

interface AdSlotProps {
  slotId?: string;
  format?: 'auto' | 'rectangle' | 'horizontal';
  className?: string;
  id?: string;
}

/**
 * Reusable AdSense placeholder slot.
 * Complies with strict AdSense guidelines:
 * - Unobtrusive, non-covering placement
 * - Clear disclosure
 * - No fake ads or click-incentivizing copy
 */
export const AdSlot: React.FC<AdSlotProps> = ({
  slotId = '0000000000',
  format = 'auto',
  className = '',
  id = 'ad-slot-placeholder',
}) => {
  return (
    <aside
      id={id}
      aria-label="Advertisement placeholder"
      className={`my-6 mx-auto w-full max-w-4xl p-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/30 text-center text-xs text-slate-400 dark:text-slate-500 overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-between px-2 pb-1 border-b border-slate-200/60 dark:border-slate-800/60 mb-2">
        <span className="uppercase tracking-wider font-semibold text-[10px]">Advertisement</span>
        <span className="text-[10px] opacity-70">AdSense Slot #{slotId}</span>
      </div>

      {/* Ad content placeholder / container for adsbygoogle */}
      <div
        className={`flex flex-col items-center justify-center min-h-[90px] ${
          format === 'rectangle' ? 'h-[250px]' : 'h-[90px]'
        }`}
      >
        <span className="text-xs font-medium text-slate-400 dark:text-slate-600">
          AdSense Ready Slot ({format})
        </span>
        <span className="text-[11px] text-slate-400/80 dark:text-slate-600 mt-1">
          Replace with your verified Publisher ID to activate
        </span>
      </div>
    </aside>
  );
};
