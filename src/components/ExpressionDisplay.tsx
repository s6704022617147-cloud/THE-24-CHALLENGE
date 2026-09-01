import React from 'react';
import { Delete, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { validateGame24Answer } from '../utils/game24';

interface ExpressionDisplayProps {
  expression: string;
  targetNumbers: number[];
  onBackspace: () => void;
  disabled?: boolean;
}

export const ExpressionDisplay: React.FC<ExpressionDisplayProps> = ({
  expression,
  targetNumbers,
  onBackspace,
  disabled = false,
}) => {
  const validation = validateGame24Answer(expression, targetNumbers);
  const usedCount = validation.usedNumbers.length;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-2 relative z-10">
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md flex flex-col gap-3">
        {/* Top Info Bar */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[11px] uppercase tracking-widest text-slate-400 font-['Plus_Jakarta_Sans',sans-serif]">
              EQUATION:
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold border ${
                usedCount === 4
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700'
              }`}
            >
              {usedCount}/4 DIGITS
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              id="btn-backspace-expr"
              onClick={onBackspace}
              disabled={disabled || !expression}
              className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 hover:text-white transition-all flex items-center gap-1 text-xs font-semibold uppercase tracking-wider"
              title="ลบตัวล่าสุด (Backspace)"
            >
              <Delete className="w-3.5 h-3.5" />
              <span>ลบ</span>
            </button>
          </div>
        </div>

        {/* Expression Display Box */}
        <div className="min-h-[84px] sm:min-h-[96px] bg-[#0b1329] border border-blue-900/40 rounded-2xl px-5 py-4 flex items-center justify-between gap-4 overflow-x-auto shadow-[inset_0_2px_12px_rgba(0,0,0,0.6)]">
          <div className="flex-1 font-['JetBrains_Mono'] text-2xl sm:text-4xl font-semibold tracking-wider text-slate-100 flex items-center flex-wrap gap-1.5">
            {expression ? (
              formatExpressionTokens(expression)
            ) : (
              <span className="text-slate-500 text-sm sm:text-base font-normal font-sans italic">
                แตะตัวเลขและเครื่องหมายด้านล่างเพื่อสร้างสมการ...
              </span>
            )}
          </div>

          {/* Real-time Result Badge */}
          {expression && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`shrink-0 px-3.5 py-2 rounded-2xl border flex items-center gap-2 font-['JetBrains_Mono'] ${
                validation.is24
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                  : validation.isValidSyntax
                  ? 'bg-blue-950/80 border-blue-800/60 text-blue-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              }`}
            >
              <span className="text-xs text-slate-400 font-sans">=</span>
              <span className="text-xl sm:text-2xl font-black">
                {validation.displayValue}
              </span>
              {validation.is24 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-0.5" />
              ) : !validation.isValidSyntax ? (
                <AlertCircle className="w-3.5 h-3.5 text-rose-400 ml-0.5" />
              ) : null}
            </motion.div>
          )}
        </div>

        {/* Live Feedback helper */}
        {expression && (
          <div className="text-xs flex items-center gap-1.5 min-h-[18px]">
            {validation.is24 ? (
              <span className="text-emerald-400 flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                ถูกต้อง! กดปุ่ม &quot;ตรวจคำตอบ&quot; หรือกด Enter เพื่อรับคะแนน
              </span>
            ) : validation.errorDetail ? (
              <span className="text-slate-400 flex items-center gap-1.5 font-mono text-[11px]">
                <span className="text-blue-400">•</span> {validation.errorDetail}
              </span>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

function formatExpressionTokens(expr: string) {
  // Format operators visually (+, -, ×, ÷)
  const elements: React.ReactNode[] = [];
  const tokens = expr.match(/(\d+(\.\d+)?|[+\-*/()])/g) || [];

  tokens.forEach((t, i) => {
    if (/[+\-*/]/.test(t)) {
      const displayOp = t === '*' ? '×' : t === '/' ? '÷' : t === '-' ? '−' : '+';
      elements.push(
        <span key={i} className="text-blue-400 font-bold px-1">
          {displayOp}
        </span>
      );
    } else if (t === '(' || t === ')') {
      elements.push(
        <span key={i} className="text-slate-400 font-bold px-0.5">
          {t}
        </span>
      );
    } else {
      elements.push(
        <span key={i} className="text-white font-extrabold bg-slate-800/90 px-2 py-0.5 rounded-lg border border-slate-700">
          {t}
        </span>
      );
    }
  });

  return elements;
}
