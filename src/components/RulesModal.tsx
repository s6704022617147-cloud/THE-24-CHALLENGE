import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, HelpCircle } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="w-full max-w-lg bg-slate-900 border-2 border-slate-700 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-400">
                  SYSTEM RULES & GUIDE
                </div>
                <h3 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans',sans-serif]">
                  กติกาการเล่นเกม 24
                </h3>
              </div>
            </div>
            <button
              id="btn-close-rules"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Rules list */}
          <div className="space-y-3 text-sm text-slate-300">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3.5">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-mono flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-blue-500/30">
                01
              </div>
              <div>
                <h4 className="font-bold text-white mb-0.5">ใช้ตัวเลข 4 ตัวที่สุ่มได้</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  ต้องนำตัวเลขทั้ง 4 ตัวมาคำนวณ โดยใช้ตัวเลขแต่ละตัว<strong>ครบ 1 ครั้งเท่านั้น</strong> (ห้ามขาดหรือเกิน)
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3.5">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-emerald-500/30">
                02
              </div>
              <div>
                <h4 className="font-bold text-white mb-0.5">เครื่องหมายที่ใช้ได้</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  สามารถใช้เครื่องหมาย บวก <code className="text-blue-300 font-mono font-bold">+</code>, ลบ <code className="text-blue-300 font-mono font-bold">−</code>, คูณ <code className="text-blue-300 font-mono font-bold">×</code>, และหาร <code className="text-blue-300 font-mono font-bold">÷</code> ได้ไม่จำกัดจำนวนครั้ง
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3.5">
              <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-mono flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-slate-700">
                03
              </div>
              <div>
                <h4 className="font-bold text-white mb-0.5">การใช้วงเล็บ ( )</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  ใส่วงเล็บ <code className="text-slate-200 font-mono font-bold">( )</code> เพื่อเปลี่ยนลำดับความสำคัญในการคำนวณ เช่น <code className="text-blue-300 font-mono">(3 + 5) × (7 − 4) = 8 × 3 = 24</code>
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3.5">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-mono flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-blue-500/30">
                04
              </div>
              <div>
                <h4 className="font-bold text-white mb-0.5">ระบบคะแนน, สิทธิ์เฉลย และสิทธิ์สุ่มใหม่</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  เมื่อตอบถูกจะได้รับคะแนนและ Streak สะสม โดย<strong>สิทธิ์สุ่มตัวเลขใหม่ใช้ได้ 1 ครั้งต่อตา</strong> และ<strong>สิทธิ์ดูเฉลยถูกจำกัดสะสมได้สูงสุดไม่เกิน 3 ครั้ง (3/3)</strong> หากยังไม่ได้ใช้จะไม่เพิ่มขึ้นอีก เมื่อสิทธิ์ยังไม่เต็ม หากตอบถูกติดต่อกันทุก ๆ 5 ข้อ (Streak x5) จะได้รับสิทธิ์ดูเฉลยฟรี 1 ครั้ง หรือใช้คะแนน <strong>500 แต้ม</strong> แลกสิทธิ์เพิ่มได้
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3.5">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-mono flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-purple-500/30">
                05
              </div>
              <div>
                <h4 className="font-bold text-white mb-0.5">ปุ่มข้ามข้อ (Skip)</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  เมื่อกดปุ่ม <strong>ข้าม (Skip)</strong> จะเปลี่ยนโจทย์เป็นข้อใหม่ทันที โดย<strong>จะรีเซ็ต Streak เหลือ 0</strong> และ<strong>ต้องเล่นตอบถูกผ่านไป 5 รอบ</strong> ปุ่มข้ามจึงจะพร้อมใช้งานใหม่อีกครั้ง
                </p>
              </div>
            </div>
          </div>

          {/* Quick tips */}
          <div className="bg-blue-950/40 border border-blue-500/30 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-blue-200">
            <HelpCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-blue-300 block mb-0.5 font-bold">คีย์ลัดบนแป้นพิมพ์:</strong>
              พิมพ์ตัวเลข, เครื่องหมาย <code className="font-mono font-bold">+ - * / ( )</code> หรือกด <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-white font-mono">Enter</kbd> เพื่อส่งคำตอบ และ <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-white font-mono">Backspace</kbd> เพื่อลบ
            </div>
          </div>

          {/* Close button */}
          <button
            id="btn-understand-rules"
            onClick={onClose}
            className="w-full py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-widest transition-all text-xs border border-blue-400 shadow-md"
          >
            เข้าใจแล้ว เริ่มเล่นเลย!
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
