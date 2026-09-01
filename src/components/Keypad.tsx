import React from 'react';
import { motion } from 'motion/react';
import { Eye, Check, Coins, RotateCcw } from 'lucide-react';

interface KeypadProps {
  onInsertOperator: (op: string) => void;
  onInsertBracket: (bracket: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  onRevealSolution: () => void;
  onSubmitAnswer: () => void;
  canSubmit: boolean;
  disabled?: boolean;
  hintsRemaining?: number;
  score?: number;
  hintCost?: number;
}

export const Keypad: React.FC<KeypadProps> = ({
  onInsertOperator,
  onInsertBracket,
  onBackspace,
  onClear,
  onRevealSolution,
  onSubmitAnswer,
  canSubmit,
  disabled = false,
  hintsRemaining = 3,
  score = 0,
  hintCost = 500,
}) => {
  const canAffordHint = hintsRemaining > 0 || score >= hintCost;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-2 relative z-10 flex flex-col gap-3">
      {/* 6-key Operation Grid: (, ), +, -, *, / */}
      <div className="grid grid-cols-6 gap-2 sm:gap-3">
        {/* Open Bracket */}
        <motion.button
          id="btn-bracket-open"
          whileTap={{ scale: 0.95 }}
          onClick={() => onInsertBracket('(')}
          disabled={disabled}
          className="h-13 sm:h-15 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-2xl font-bold font-['JetBrains_Mono'] transition-all flex items-center justify-center shadow-sm disabled:opacity-40"
        >
          (
        </motion.button>

        {/* Close Bracket */}
        <motion.button
          id="btn-bracket-close"
          whileTap={{ scale: 0.95 }}
          onClick={() => onInsertBracket(')')}
          disabled={disabled}
          className="h-13 sm:h-15 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-2xl font-bold font-['JetBrains_Mono'] transition-all flex items-center justify-center shadow-sm disabled:opacity-40"
        >
          )
        </motion.button>

        {/* Add Operator */}
        <motion.button
          id="btn-op-add"
          whileTap={{ scale: 0.95 }}
          onClick={() => onInsertOperator('+')}
          disabled={disabled}
          className="h-13 sm:h-15 rounded-xl bg-slate-900 border border-slate-700/90 hover:border-blue-400 text-blue-400 hover:text-blue-300 hover:bg-slate-800 text-2xl sm:text-3xl font-extrabold font-['JetBrains_Mono'] transition-all flex items-center justify-center shadow-sm disabled:opacity-40"
        >
          +
        </motion.button>

        {/* Subtract Operator */}
        <motion.button
          id="btn-op-sub"
          whileTap={{ scale: 0.95 }}
          onClick={() => onInsertOperator('-')}
          disabled={disabled}
          className="h-13 sm:h-15 rounded-xl bg-slate-900 border border-slate-700/90 hover:border-blue-400 text-blue-400 hover:text-blue-300 hover:bg-slate-800 text-2xl sm:text-3xl font-extrabold font-['JetBrains_Mono'] transition-all flex items-center justify-center shadow-sm disabled:opacity-40"
        >
          −
        </motion.button>

        {/* Multiply Operator */}
        <motion.button
          id="btn-op-mul"
          whileTap={{ scale: 0.95 }}
          onClick={() => onInsertOperator('*')}
          disabled={disabled}
          className="h-13 sm:h-15 rounded-xl bg-slate-900 border border-slate-700/90 hover:border-blue-400 text-blue-400 hover:text-blue-300 hover:bg-slate-800 text-2xl sm:text-3xl font-extrabold font-['JetBrains_Mono'] transition-all flex items-center justify-center shadow-sm disabled:opacity-40"
        >
          ×
        </motion.button>

        {/* Divide Operator */}
        <motion.button
          id="btn-op-div"
          whileTap={{ scale: 0.95 }}
          onClick={() => onInsertOperator('/')}
          disabled={disabled}
          className="h-13 sm:h-15 rounded-xl bg-slate-900 border border-slate-700/90 hover:border-blue-400 text-blue-400 hover:text-blue-300 hover:bg-slate-800 text-2xl sm:text-3xl font-extrabold font-['JetBrains_Mono'] transition-all flex items-center justify-center shadow-sm disabled:opacity-40"
        >
          ÷
        </motion.button>
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-2.5 sm:gap-4 pt-1">
        {/* Clear Equation Button */}
        <motion.button
          id="btn-keypad-clear"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClear}
          disabled={disabled}
          className="flex-1 min-w-[120px] py-3.5 px-4 bg-slate-900/90 border border-slate-800 hover:border-slate-600 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-slate-800 text-slate-300 transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-40 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-slate-400" />
          <span>ล้าง (Clear)</span>
        </motion.button>

        {/* Reveal Solution (ดูเฉลย / แลกเฉลยด้วยแต้ม) */}
        <motion.button
          id="btn-reveal-solution"
          whileHover={canAffordHint && !disabled ? { scale: 1.02 } : {}}
          whileTap={canAffordHint && !disabled ? { scale: 0.98 } : {}}
          onClick={onRevealSolution}
          disabled={disabled || !canAffordHint}
          title={
            hintsRemaining > 0
              ? `ดูเฉลย (เหลือสิทธิ์คงเหลือ ${hintsRemaining}/3 ครั้ง)`
              : score >= hintCost
              ? `ใช้ ${hintCost} คะแนนเพื่อดูเฉลย (คุณมี ${score.toLocaleString()} แต้ม)`
              : `สิทธิ์หมดและต้องใช้ ${hintCost} คะแนน (คุณมี ${score.toLocaleString()} แต้ม)`
          }
          className={`flex-1 min-w-[140px] py-3.5 px-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
            hintsRemaining > 0 && !disabled
              ? 'bg-blue-600 border border-blue-400 hover:bg-blue-500 text-white shadow-[0_0_25px_rgba(37,99,235,0.35)] cursor-pointer'
              : score >= hintCost && !disabled
              ? 'bg-amber-600/90 border border-amber-400 hover:bg-amber-500 text-white shadow-[0_0_25px_rgba(245,158,11,0.35)] cursor-pointer'
              : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed opacity-50 shadow-none'
          }`}
        >
          {hintsRemaining > 0 ? (
            <>
              <Eye className="w-4 h-4 text-blue-200" />
              <span>เฉลย ({hintsRemaining}/3)</span>
            </>
          ) : score >= hintCost ? (
            <>
              <Coins className="w-4 h-4 text-amber-200" />
              <span>เฉลย (-{hintCost}แต้ม)</span>
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 text-slate-600" />
              <span>เฉลย ({hintCost} แต้ม)</span>
            </>
          )}
        </motion.button>

        {/* Submit Answer (ตรวจคำตอบ) */}
        <motion.button
          id="btn-submit-answer"
          whileHover={canSubmit && !disabled ? { scale: 1.02 } : {}}
          whileTap={canSubmit && !disabled ? { scale: 0.98 } : {}}
          onClick={onSubmitAnswer}
          disabled={disabled || !canSubmit}
          className={`flex-[1.3] min-w-[150px] py-3.5 px-6 rounded-full font-black uppercase tracking-widest text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
            canSubmit && !disabled
              ? 'bg-emerald-500 text-slate-950 border border-emerald-400 hover:bg-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.35)] cursor-pointer'
              : 'bg-slate-800/80 border border-slate-700 text-slate-500 cursor-not-allowed opacity-50'
          }`}
        >
          <Check className="w-4 h-4 font-black" />
          <span>ตรวจคำตอบ</span>
        </motion.button>
      </div>
    </div>
  );
};
