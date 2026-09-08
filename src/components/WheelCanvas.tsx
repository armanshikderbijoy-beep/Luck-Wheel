import React, { useRef, useEffect, useCallback } from 'react';
import { WheelEntry, WheelThemeId } from '../types';
import { WHEEL_THEMES } from '../data/themes';
import { INDICATOR_ANGLE, calculateTargetRotation, easeOutQuart } from '../utils/wheelMath';
import { playTickSound, playCelebrationChime } from '../utils/audio';

interface WheelCanvasProps {
  entries: WheelEntry[];
  themeId: WheelThemeId;
  isSpinning: boolean;
  soundEnabled: boolean;
  onSpinStart: () => void;
  onSpinComplete: (winner: WheelEntry) => void;
  targetWinner: WheelEntry | null;
  targetWinnerIndex: number | null;
}

export const WheelCanvas: React.FC<WheelCanvasProps> = ({
  entries,
  themeId,
  isSpinning,
  soundEnabled,
  onSpinStart,
  onSpinComplete,
  targetWinner,
  targetWinnerIndex,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Store continuous rotation angle (in radians)
  const currentRotationRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastTickSliceRef = useRef<number>(-1);

  const theme = WHEEL_THEMES[themeId] || WHEEL_THEMES.vibrant;

  // Render the wheel onto the canvas
  const drawWheel = useCallback(
    (rotation: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      // Reserve margin for outer rim and shadow
      const radius = Math.min(centerX, centerY) - 18;
      if (radius <= 10) return;

      const count = entries.length;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);

      if (count === 0) {
        // Empty placeholder wheel
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#E2E8F0';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#CBD5E1';
        ctx.stroke();

        ctx.restore();
        return;
      }

      const sliceAngle = (2 * Math.PI) / count;

      // 1. Draw Wheel Segments
      for (let i = 0; i < count; i++) {
        const startAngle = i * sliceAngle;
        const endAngle = startAngle + sliceAngle;
        const color = theme.colors[i % theme.colors.length];

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();

        // Subtle slice divider
        ctx.lineWidth = Math.max(1, Math.min(3, 16 / count));
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.stroke();

        // 2. Draw Entry Text
        ctx.save();
        const midAngle = startAngle + sliceAngle / 2;
        ctx.rotate(midAngle);

        // Adjust font size based on slice count and radius
        let fontSize = Math.floor(Math.min(18, Math.max(10, (radius * 1.8) / Math.max(count, 4))));
        if (count > 24) fontSize = 9;

        ctx.fillStyle = theme.textColor;
        ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 3;

        // Truncate text if it's too long to fit in radial length
        const maxTextWidth = radius * 0.58;
        let displayText = entries[i].text;
        if (ctx.measureText(displayText).width > maxTextWidth) {
          while (displayText.length > 3 && ctx.measureText(displayText + '…').width > maxTextWidth) {
            displayText = displayText.slice(0, -1);
          }
          displayText += '…';
        }

        ctx.fillText(displayText, radius - 20, 0);
        ctx.restore();
      }

      // 3. Draw Outer Decorative Ring & Pegs (Pins)
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, 2 * Math.PI);
      ctx.lineWidth = 8;
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.stroke();

      // Draw shiny pegs at segment divisions
      const pegCount = Math.max(count, 12);
      const pegStep = (2 * Math.PI) / pegCount;
      for (let p = 0; p < pegCount; p++) {
        const pAngle = p * pegStep;
        const pegX = Math.cos(pAngle) * (radius - 4);
        const pegY = Math.sin(pAngle) * (radius - 4);

        ctx.beginPath();
        ctx.arc(pegX, pegY, 3.5, 0, 2 * Math.PI);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#94A3B8';
        ctx.stroke();
      }

      // 4. Center Hub
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(28, radius * 0.18), 0, 2 * Math.PI);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.beginPath();
      ctx.arc(0, 0, Math.max(20, radius * 0.13), 0, 2 * Math.PI);
      ctx.fillStyle = theme.accentColor;
      ctx.fill();

      // Center decorative inner dot
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      ctx.restore();
    },
    [entries, theme]
  );

  // Resize canvas when container dimensions change
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      const size = Math.floor(Math.min(rect.width, 460));
      const dpr = window.devicePixelRatio || 1;

      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }

      drawWheel(currentRotationRef.current);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawWheel]);

  // Redraw when theme or entries change (while not actively animating)
  useEffect(() => {
    if (!isSpinning) {
      drawWheel(currentRotationRef.current);
    }
  }, [entries, theme, isSpinning, drawWheel]);

  // Handle spin animation loop
  useEffect(() => {
    if (!isSpinning || targetWinnerIndex === null || !targetWinner || entries.length < 2) {
      return;
    }

    const startRotation = currentRotationRef.current;
    const finalRotation = calculateTargetRotation(
      startRotation,
      targetWinnerIndex,
      entries.length
    );

    const spinDuration = 4500; // 4.5 seconds of smooth deceleration
    const startTime = performance.now();
    const count = entries.length;
    const sliceAngle = (2 * Math.PI) / count;

    lastTickSliceRef.current = -1;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / spinDuration);
      const eased = easeOutQuart(progress);

      const currentRotation = startRotation + (finalRotation - startRotation) * eased;
      currentRotationRef.current = currentRotation;

      drawWheel(currentRotation);

      // Mechanical tick detection:
      // Check which slice boundary passed the top indicator
      if (soundEnabled && progress < 0.98) {
        const spotOnWheel = (INDICATOR_ANGLE - currentRotation) % (2 * Math.PI);
        const normalizedSpot = spotOnWheel < 0 ? spotOnWheel + 2 * Math.PI : spotOnWheel;
        const currentSlice = Math.floor(normalizedSpot / sliceAngle);

        if (currentSlice !== lastTickSliceRef.current) {
          lastTickSliceRef.current = currentSlice;
          playTickSound(Math.max(0.08, 0.3 * (1 - progress * 0.7)));
        }
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Precise final placement
        currentRotationRef.current = finalRotation;
        drawWheel(finalRotation);

        if (soundEnabled) {
          playCelebrationChime();
        }

        onSpinComplete(targetWinner);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isSpinning, targetWinnerIndex, targetWinner, entries.length, soundEnabled, drawWheel, onSpinComplete]);

  const canSpin = entries.length >= 2 && !isSpinning;

  return (
    <div
      ref={containerRef}
      id="wheel-canvas-container"
      className="relative flex flex-col items-center justify-center p-3 sm:p-5 w-full max-w-[480px] mx-auto select-none"
    >
      {/* Top Pointer Needle Indicator */}
      <div
        id="wheel-pointer-indicator"
        className="absolute top-2 z-20 flex flex-col items-center pointer-events-none drop-shadow-md"
        aria-hidden="true"
      >
        {/* Custom high-contrast pointer triangle */}
        <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[28px] border-t-rose-600 dark:border-t-rose-500 filter drop-shadow-sm transform -translate-y-1" />
        <div className="w-3 h-3 rounded-full bg-slate-900 border-2 border-white -mt-7 shadow-sm" />
      </div>

      {/* HTML5 Canvas */}
      <div className="relative rounded-full shadow-xl shadow-slate-300/40 dark:shadow-black/50 overflow-hidden bg-white dark:bg-slate-900">
        <canvas
          ref={canvasRef}
          id="wheel-canvas"
          className="block cursor-pointer transition-transform duration-75"
          onClick={() => {
            if (canSpin) onSpinStart();
          }}
          aria-label="Wheel Spinner interactive canvas"
          role="img"
        />

        {/* Big Center Clickable Spin Hub Button */}
        <button
          id="wheel-center-spin-btn"
          type="button"
          onClick={onSpinStart}
          disabled={!canSpin}
          aria-label={isSpinning ? 'Wheel is spinning' : 'Spin the wheel'}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center font-black text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 z-10 shadow-lg ${
            isSpinning
              ? 'bg-slate-800 text-slate-300 opacity-90 cursor-wait scale-95 ring-4 ring-slate-700/50'
              : entries.length < 2
              ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
              : 'bg-slate-900 hover:bg-indigo-600 active:scale-95 text-white hover:shadow-indigo-500/30 ring-4 ring-white/90 dark:ring-slate-950 cursor-pointer'
          }`}
        >
          {isSpinning ? (
            <span className="animate-pulse">Spinning...</span>
          ) : (
            <>
              <span className="text-base sm:text-lg leading-tight">SPIN</span>
              <span className="text-[9px] sm:text-[10px] font-medium opacity-80">Click</span>
            </>
          )}
        </button>
      </div>

      {/* Helper text under wheel for mobile/touch */}
      <div className="mt-4 text-center">
        {entries.length < 2 ? (
          <p id="wheel-status-help" className="text-xs text-amber-600 dark:text-amber-400 font-medium">
            Add at least 2 entries to spin
          </p>
        ) : (
          <p id="wheel-status-help" className="text-xs text-slate-400 dark:text-slate-500">
            Tap wheel or click SPIN to pick a random winner
          </p>
        )}
      </div>
    </div>
  );
};
