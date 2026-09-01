import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

interface NumberCardsProps {
  numbers: number[];
  usedCounts: { [val: number]: number };
  onCardClick: (num: number, cardIdx: number) => void;
  disabled?: boolean;
}

export const NumberCards: React.FC<NumberCardsProps> = ({
  numbers,
  usedCounts,
  onCardClick,
  disabled = false,
}) => {
  // Track how many times each number is available vs used
  const occurrences: { [val: number]: number } = {};

  // Geometric balance subtle alternating tilt angles
  const tilts = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2'];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-2 relative z-10">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-1.5 font-['Plus_Jakarta_Sans',sans-serif]">
          <span>Given Integers</span>
          <span className="text-slate-600 font-mono">(แตะเพื่อเลือก)</span>
        </span>
        <span className="text-xs text-blue-400 font-mono font-semibold">
          [USE ALL 4 DIGITS]
        </span>
      </div>

      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        {numbers.map((num, idx) => {
          occurrences[num] = (occurrences[num] || 0) + 1;
          const currentOccurrence = occurrences[num];
          const usedForThisNumber = usedCounts[num] || 0;
          const isUsed = usedForThisNumber >= currentOccurrence;
          const defaultTilt = tilts[idx % tilts.length];

          return (
            <motion.button
              key={`${idx}-${num}`}
              id={`card-num-${idx}`}
              whileHover={!disabled && !isUsed ? { scale: 1.05, y: -4, rotate: 0 } : {}}
              whileTap={!disabled && !isUsed ? { scale: 0.95 } : {}}
              onClick={() => onCardClick(num, idx)}
              disabled={disabled || isUsed}
              aria-label={`เลือกตัวเลข ${num} ${isUsed ? '(ใช้แล้ว)' : ''}`}
              className={`relative h-28 sm:h-36 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 ${
                isUsed
                  ? 'bg-slate-900/40 border border-slate-800 text-slate-600 cursor-not-allowed opacity-50 scale-[0.96] rotate-0 shadow-none'
                  : `bg-slate-900/90 border-2 border-slate-700/90 hover:border-blue-400 text-white shadow-[0_15px_35px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.25)] ${defaultTilt}`
              }`}
            >
              {/* Corner badge index indicator */}
              <span
                className={`absolute top-2.5 left-3 text-[10px] font-mono tracking-wider ${
                  isUsed
                    ? 'text-slate-600'
                    : 'text-blue-400 font-bold'
                }`}
              >
                0{idx + 1}
              </span>

              {/* Status icon if used */}
              {isUsed && (
                <div className="absolute top-2.5 right-3 p-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}

              {/* Number display */}
              <span
                className={`text-5xl sm:text-6xl font-black font-['Plus_Jakarta_Sans',sans-serif] tracking-tight leading-none ${
                  isUsed ? 'text-slate-600 line-through decoration-slate-600/70' : 'text-white drop-shadow-md'
                }`}
              >
                {num}
              </span>

              {/* Helper caption */}
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mt-1">
                {isUsed ? 'USED' : 'SELECT'}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
