import React from 'react';
import { Trophy, Flame, Volume2, VolumeX, HelpCircle, RefreshCw, Layers, SkipForward } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  score: number;
  streak: number;
  bestStreak: number;
  round: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenRules: () => void;
  onNewGame: () => void;
  rerollsRemaining?: number;
  onSkip?: () => void;
  skipCooldown?: number;
}

export const Header: React.FC<HeaderProps> = ({
  score,
  streak,
  bestStreak,
  round,
  isMuted,
  onToggleMute,
  onOpenRules,
  onNewGame,
  rerollsRemaining = 1,
  onSkip,
  skipCooldown = 0,
}) => {
  const isSkipReady = skipCooldown === 0;
  return (
    <header className="w-full max-w-3xl mx-auto px-4 pt-5 pb-3 flex flex-col gap-4 relative z-10">
      {/* Top Navbar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-850 border-slate-800/80 pb-4">
        {/* Brand & Logic Sequence Header */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-black tracking-[0.35em] text-blue-400 uppercase font-['Plus_Jakarta_Sans',sans-serif]">
              Logic Sequence
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
          </div>
          <div className="flex items-baseline gap-2.5">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-white font-['Plus_Jakarta_Sans',sans-serif] leading-none">
              THE <span className="text-blue-400 font-['Instrument_Serif',serif] italic font-normal tracking-normal text-4xl sm:text-5xl lg:text-6xl">24</span> CHALLENGE
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-blue-950/60 border border-blue-800/60 text-blue-300 font-medium font-mono hidden sm:inline-block">
              เกม 24
            </span>
          </div>
        </div>

        {/* Top Actions & Score Indicators */}
        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6">
          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            <button
              id="btn-rules"
              onClick={onOpenRules}
              aria-label="กติกาการเล่น"
              className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-blue-300 hover:border-blue-500/50 hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
              title="วิธีเล่นและกติกา"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            <button
              id="btn-sound-toggle"
              onClick={onToggleMute}
              aria-label={isMuted ? 'เปิดเสียง' : 'ปิดเสียง'}
              className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-blue-300 hover:border-blue-500/50 hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
              title={isMuted ? 'เปิดเสียง' : 'ปิดเสียง'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-blue-400" />}
            </button>

            <button
              id="btn-quick-new-game"
              onClick={onNewGame}
              disabled={rerollsRemaining <= 0}
              aria-label="สุ่มโจทย์ใหม่"
              className={`px-3 py-2 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${
                rerollsRemaining > 0
                  ? 'bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white hover:border-blue-500/40 hover:bg-slate-800 cursor-pointer shadow-sm'
                  : 'bg-slate-900/40 border-slate-800/40 text-slate-600 cursor-not-allowed opacity-50'
              }`}
              title={
                rerollsRemaining > 0
                  ? 'สุ่มตัวเลขใหม่ (เหลือสิทธิ์ 1 ครั้งในตานี้)'
                  : 'ใช้สิทธิ์สุ่มใหม่ในตานี้ไปแล้ว (จำกัด 1 ครั้งต่อตา)'
              }
            >
              <RefreshCw className={`w-3.5 h-3.5 ${rerollsRemaining > 0 ? '' : 'text-slate-600'}`} />
              <span className="hidden xs:inline">สุ่มใหม่</span>
              <span>({rerollsRemaining}/1)</span>
            </button>

            {onSkip && (
              <button
                id="btn-header-skip"
                onClick={onSkip}
                disabled={!isSkipReady}
                aria-label="ข้ามข้อนี้"
                className={`px-3 py-2 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-purple-400 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${
                  isSkipReady
                    ? 'bg-slate-900/90 border-purple-500/40 text-purple-300 hover:text-white hover:border-purple-400 hover:bg-purple-950/40 cursor-pointer shadow-sm'
                    : 'bg-slate-900/40 border-slate-800/40 text-slate-600 cursor-not-allowed opacity-50'
                }`}
                title={
                  isSkipReady
                    ? 'ข้ามข้อนี้ (รีเซ็ต Streak เป็น 0 และติดคูลดาวน์ 5 รอบ)'
                    : `ปุ่มข้ามกำลังติดคูลดาวน์ (ต้องเล่นผ่านอีก ${skipCooldown} ข้อถึงจะใช้ได้)`
                }
              >
                <SkipForward className={`w-3.5 h-3.5 ${isSkipReady ? 'text-purple-400' : 'text-slate-600'}`} />
                <span className="hidden xs:inline">ข้าม</span>
                <span>{isSkipReady ? '' : `(${skipCooldown})`}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Geometric Stats Bar */}
      <div className="grid grid-cols-3 gap-3">
        {/* Score Card */}
        <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-3 sm:px-4 sm:py-3 flex flex-col justify-between backdrop-blur-sm shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[10px] sm:text-xs uppercase tracking-widest font-bold">
            <span>Score</span>
            <Trophy className="w-3.5 h-3.5 text-emerald-400/80" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400 mt-1">
            {score.toLocaleString()}
          </div>
        </div>

        {/* Streak Card */}
        <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-3 sm:px-4 sm:py-3 flex flex-col justify-between backdrop-blur-sm shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[10px] sm:text-xs uppercase tracking-widest font-bold">
            <span>Streak</span>
            <Flame className={`w-3.5 h-3.5 ${streak > 0 ? 'text-blue-400' : 'text-slate-600'}`} />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-blue-400 mt-1 flex items-baseline gap-1.5">
            <span>{streak}</span>
            {bestStreak > 0 && (
              <span className="text-[10px] sm:text-xs text-slate-500 font-sans font-normal">
                (max {bestStreak})
              </span>
            )}
          </div>
        </div>

        {/* Level / Round Card */}
        <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-3 sm:px-4 sm:py-3 flex flex-col justify-between backdrop-blur-sm shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[10px] sm:text-xs uppercase tracking-widest font-bold">
            <span>Level</span>
            <Layers className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-white mt-1">
            {round < 10 ? `0${round}` : round}
          </div>
        </div>
      </div>
    </header>
  );
};
