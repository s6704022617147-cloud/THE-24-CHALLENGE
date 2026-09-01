import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Lightbulb, RefreshCw, Copy, Sparkles, Plus, Coins } from 'lucide-react';

interface SolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  numbers: number[];
  solutions: string[];
  onApplySolution: (solution: string) => void;
  onNewGame: () => void;
  hintsRemaining?: number;
  score?: number;
  hintCost?: number;
  onBuyHint?: () => void;
  rerollsRemaining?: number;
}

export const SolutionModal: React.FC<SolutionModalProps> = ({
  isOpen,
  onClose,
  numbers,
  solutions,
  onApplySolution,
  onNewGame,
  hintsRemaining = 0,
  score = 0,
  hintCost = 500,
  onBuyHint,
  rerollsRemaining = 1,
}) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleCopy = (solution: string, idx: number) => {
    navigator.clipboard.writeText(solution);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="w-full max-w-lg bg-slate-900 border-2 border-blue-500/40 rounded-3xl p-6 sm:p-7 shadow-[0_0_70px_rgba(37,99,235,0.25)] flex flex-col gap-4 max-h-[85vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-400">
                  SYSTEM SOLUTIONS
                </div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2 font-['Plus_Jakarta_Sans',sans-serif]">
                  <span>เฉลยเกม 24</span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-blue-300 font-mono">
                    {solutions.length} วิธี
                  </span>
                </h3>
              </div>
            </div>
            <button
              id="btn-close-solution"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between text-xs px-1 font-mono gap-2 flex-wrap">
            <span className="text-slate-400">
              โจทย์: <strong className="text-blue-400">[{numbers.join(', ')}]</strong>
            </span>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg font-semibold text-[11px] bg-blue-950/60 border border-blue-500/30 text-blue-300 flex items-center gap-1.5">
                <span>สิทธิ์คงเหลือ:</span>
                <strong className="font-bold font-mono text-white">{hintsRemaining}/3</strong>
              </span>
              {onBuyHint && (
                <button
                  id="btn-buy-hint-in-modal"
                  onClick={onBuyHint}
                  disabled={score < hintCost || hintsRemaining >= 3}
                  title={
                    hintsRemaining >= 3
                      ? 'สิทธิ์ดูเฉลยสะสมเต็มแล้ว (สูงสุด 3 ครั้ง)'
                      : score >= hintCost
                      ? `แลกสิทธิ์เฉลย +1 ครั้ง (${hintCost} แต้ม)`
                      : `คะแนนไม่พอ ต้องการ ${hintCost} แต้ม`
                  }
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 border ${
                    hintsRemaining >= 3
                      ? 'bg-slate-800/40 border-slate-800 text-slate-500 cursor-not-allowed'
                      : score >= hintCost
                      ? 'bg-amber-600/20 border-amber-500/40 text-amber-300 hover:bg-amber-600 hover:text-white cursor-pointer'
                      : 'bg-slate-800/40 border-slate-800 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <Coins className="w-3 h-3 text-amber-400" />
                  <span>
                    {hintsRemaining >= 3 ? 'สิทธิ์เต็ม (3/3)' : `แลกสิทธิ์ +1 (${hintCost} แต้ม)`}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Solutions List */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 min-h-[140px] max-h-[360px]">
            {solutions.length > 0 ? (
              solutions.map((sol, idx) => {
                const formatted = sol
                  .replace(/\*/g, ' × ')
                  .replace(/\//g, ' ÷ ')
                  .replace(/\+/g, ' + ')
                  .replace(/-/g, ' − ')
                  .replace(/\s+/g, ' ')
                  .trim();

                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 transition-colors flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-slate-500 w-6">
                        0{idx + 1}
                      </span>
                      <div className="font-['JetBrains_Mono'] text-base sm:text-lg font-bold text-blue-100 tracking-wide">
                        {formatted} <span className="text-emerald-400 font-black">= 24</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100">
                      <button
                        onClick={() => handleCopy(sol, idx)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-1 border border-slate-700"
                        title="คัดลอกสมการ"
                      >
                        {copiedIdx === idx ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          onApplySolution(sol);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600 border border-blue-500/40 text-blue-200 hover:text-white transition-colors text-xs font-semibold uppercase tracking-wider flex items-center gap-1"
                        title="นำสูตรนี้ไปใส่ในช่องคำตอบ"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>ใส่สูตร</span>
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-slate-500 font-mono">
                ไม่พบวิธีแก้โจทย์นี้
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center gap-2.5 pt-2 border-t border-slate-800">
            <button
              id="btn-solution-new-game"
              onClick={() => {
                if (rerollsRemaining > 0) {
                  onClose();
                  onNewGame();
                }
              }}
              disabled={rerollsRemaining <= 0}
              className={`flex-1 py-3 px-4 rounded-full border transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${
                rerollsRemaining > 0
                  ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200 hover:text-white cursor-pointer'
                  : 'bg-slate-900/60 border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
              }`}
              title={
                rerollsRemaining > 0
                  ? 'สุ่มโจทย์ใหม่ (เหลือสิทธิ์ 1 ครั้งในตานี้)'
                  : 'ใช้สิทธิ์สุ่มใหม่ในตานี้ไปแล้ว (จำกัด 1 ครั้งต่อตา)'
              }
            >
              <RefreshCw className="w-4 h-4" />
              <span>สุ่มโจทย์ใหม่ ({rerollsRemaining}/1)</span>
            </button>
            <button
              id="btn-solution-close-bottom"
              onClick={onClose}
              className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-widest transition-all text-xs border border-blue-400 shadow-md cursor-pointer"
            >
              ปิด
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
