import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Trophy, Flame, ArrowRight, CheckCircle2, RotateCcw, Clock, Sparkles, Gift } from 'lucide-react';

interface CelebrationModalProps {
  isOpen: boolean;
  score: number;
  addedScore: number;
  streak: number;
  solvedExpression: string;
  elapsedSeconds: number;
  earnedFreeHint?: boolean;
  onNextGame: () => void;
  onPlayAgainCurrent: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  score,
  addedScore,
  streak,
  solvedExpression,
  elapsedSeconds,
  earnedFreeHint = false,
  onNextGame,
  onPlayAgainCurrent,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Confetti burst
      try {
        confetti({
          particleCount: earnedFreeHint ? 120 : 80,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#10b981', '#38bdf8', '#f59e0b', '#f43f5e'],
        });
      } catch {
        // ignore
      }
    }
  }, [isOpen, earnedFreeHint]);

  if (!isOpen) return null;

  const formattedFormula = solvedExpression
    .replace(/\*/g, ' × ')
    .replace(/\//g, ' ÷ ')
    .replace(/\+/g, ' + ')
    .replace(/-/g, ' − ')
    .replace(/\s+/g, ' ')
    .trim();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 20 }}
          className="w-full max-w-md bg-slate-900 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(16,185,129,0.25)] text-center flex flex-col items-center gap-5"
        >
          {/* Trophy / Check badge */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200 }}
            className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 shadow-xl shadow-emerald-500/40"
          >
            <Trophy className="w-10 h-10 stroke-[2.5]" />
          </motion.div>

          {/* Heading */}
          <div>
            <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs uppercase tracking-widest font-black mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Target Achieved • ถูกต้อง</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-['Plus_Jakarta_Sans',sans-serif] tracking-tight">
              EVALUATED TO 24
            </h2>
          </div>

          {/* Streak Bonus Reward Banner if 5 consecutive answers */}
          {earnedFreeHint && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="w-full bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-blue-900/60 border border-blue-400/60 rounded-2xl p-3 flex items-center justify-center gap-2.5 text-blue-200 shadow-[0_0_20px_rgba(59,130,246,0.35)]"
            >
              <Gift className="w-5 h-5 text-amber-300 animate-bounce shrink-0" />
              <div className="text-left">
                <div className="text-xs font-black text-white tracking-wide flex items-center gap-1">
                  <span>STREAK BONUS! ตอบถูก {streak} ข้อติด</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-[11px] text-blue-300 font-medium">
                  คุณได้รับ <strong className="text-amber-300 font-bold">สิทธิ์ดูเฉลยฟรี +1 ครั้ง</strong> 🎉
                </div>
              </div>
            </motion.div>
          )}

          {/* Solved formula display */}
          <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 px-4 shadow-inner">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block mb-1">
              Solved Equation
            </span>
            <div className="font-['JetBrains_Mono'] text-xl font-black text-emerald-300">
              {formattedFormula} <span className="text-white">= 24</span>
            </div>
          </div>

          {/* Confetti & Streak metrics */}
          <div className="w-full grid grid-cols-3 gap-2.5 text-left">
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Score</div>
              <div className="text-lg sm:text-xl font-bold font-['JetBrains_Mono'] text-emerald-400">
                +{addedScore}
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3 h-3 text-blue-400" />
                <span>Streak</span>
              </div>
              <div className="text-lg sm:text-xl font-bold font-['JetBrains_Mono'] text-blue-400">
                {streak}x
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Time</span>
              </div>
              <div className="text-lg sm:text-xl font-bold font-['JetBrains_Mono'] text-white">
                {elapsedSeconds}s
              </div>
            </div>
          </div>

          {/* Total Score Banner */}
          <div className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-blue-950/40 border border-blue-500/30 text-blue-200 text-sm font-semibold">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">TOTAL SCORE:</span>
            <span className="text-base font-bold font-['JetBrains_Mono'] text-emerald-400">
              {score.toLocaleString()} PTS
            </span>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col sm:flex-row gap-2.5 pt-1">
            <button
              id="btn-play-again-current"
              onClick={onPlayAgainCurrent}
              className="py-3.5 px-4 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>คิดวิธีอื่นในข้อนี้</span>
            </button>

            <button
              id="btn-next-game-celebration"
              onClick={onNextGame}
              className="flex-1 py-3.5 px-5 rounded-full bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-black uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 text-xs sm:text-sm border border-emerald-400 cursor-pointer"
            >
              <span>ข้อถัดไป (Next)</span>
              <ArrowRight className="w-4 h-4 font-black" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
