/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { NumberCards } from './components/NumberCards';
import { ExpressionDisplay } from './components/ExpressionDisplay';
import { Keypad } from './components/Keypad';
import { SolutionModal } from './components/SolutionModal';
import { CelebrationModal } from './components/CelebrationModal';
import { RulesModal } from './components/RulesModal';
import { generate24Puzzle, validateGame24Answer } from './utils/game24';
import { sound } from './utils/sound';
import { motion } from 'motion/react';
import { AlertTriangle, Sparkles, RefreshCw } from 'lucide-react';

const HINT_COST = 500;
const INITIAL_HINTS = 3;
const MAX_HINTS = 3;

export default function App() {
  // Game Puzzle State
  const [numbers, setNumbers] = useState<number[]>([1, 2, 3, 4]);
  const [solutions, setSolutions] = useState<string[]>([]);
  const [expression, setExpression] = useState<string>('');
  const [round, setRound] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [hintsRemaining, setHintsRemaining] = useState<number>(INITIAL_HINTS);
  const [rerollsRemaining, setRerollsRemaining] = useState<number>(1);
  const [skipCooldown, setSkipCooldown] = useState<number>(0);
  
  // Modals & Popups
  const [isCelebrationOpen, setIsCelebrationOpen] = useState<boolean>(false);
  const [isSolutionOpen, setIsSolutionOpen] = useState<boolean>(false);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [lastAddedScore, setLastAddedScore] = useState<number>(0);
  const [earnedFreeHintThisRound, setEarnedFreeHintThisRound] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Time tracking
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [shakeKey, setShakeKey] = useState<number>(0);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  // Start a new puzzle round
  const startNewRound = useCallback((incrementRound = false) => {
    const puzzle = generate24Puzzle(9);
    setNumbers(puzzle.numbers);
    setSolutions(puzzle.solutions);
    setExpression('');
    setStartTime(Date.now());
    setElapsedSeconds(0);
    setIsCelebrationOpen(false);
    setIsSolutionOpen(false);
    setEarnedFreeHintThisRound(false);
    setFeedbackError(null);
    if (incrementRound) {
      setRound(prev => prev + 1);
      setRerollsRemaining(1);
    }
  }, []);

  // Initialize first game on mount
  useEffect(() => {
    const puzzle = generate24Puzzle(9);
    setNumbers(puzzle.numbers);
    setSolutions(puzzle.solutions);
    setStartTime(Date.now());
  }, []);

  // Timer counter
  useEffect(() => {
    if (isCelebrationOpen || isSolutionOpen) return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, isCelebrationOpen, isSolutionOpen]);

  // Track used counts of each number from current expression
  const usedCounts = useMemo(() => {
    const counts: { [val: number]: number } = {};
    const tokens = expression.match(/\d+(\.\d+)?/g) || [];
    for (const t of tokens) {
      const val = parseFloat(t);
      counts[val] = (counts[val] || 0) + 1;
    }
    return counts;
  }, [expression]);

  // Validation state
  const validation = useMemo(() => {
    return validateGame24Answer(expression, numbers);
  }, [expression, numbers]);

  // Handle clicking a number card
  const handleCardClick = (num: number) => {
    sound.playCardPick();
    setFeedbackError(null);
    setExpression(prev => {
      // If the last character is a digit, add an operator or just append?
      // In 24 game, usually clicking a number appends it
      if (/\d$/.test(prev)) {
        // If previous ends with number, maybe don't merge into multi-digit unless intended
        return prev + ' * ' + num;
      }
      return prev + num;
    });
  };

  // Handle inserting an operator (+, -, *, /)
  const handleInsertOperator = (op: string) => {
    sound.playClick();
    setFeedbackError(null);
    setExpression(prev => {
      if (!prev) {
        if (op === '-') return '-';
        return prev;
      }
      // If ends with another operator, replace it
      if (/[+\-*/]$/.test(prev.trim())) {
        return prev.trim().slice(0, -1) + op;
      }
      return prev + op;
    });
  };

  // Handle inserting brackets
  const handleInsertBracket = (bracket: string) => {
    sound.playClick();
    setFeedbackError(null);
    setExpression(prev => prev + bracket);
  };

  // Handle backspace
  const handleBackspace = () => {
    sound.playClick();
    setFeedbackError(null);
    setExpression(prev => {
      if (!prev) return '';
      // If trimmed ends with number or operator, remove one char
      return prev.slice(0, -1);
    });
  };

  // Handle clear
  const handleClear = () => {
    sound.playReset();
    setFeedbackError(null);
    setExpression('');
  };

  // Check answer & submit
  const handleSubmitAnswer = () => {
    const res = validateGame24Answer(expression, numbers);

    if (res.is24) {
      // User won this round!
      sound.playCorrect();
      const timeTaken = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
      
      // Calculate score: Base 100 + Time Bonus (up to 50) + Streak Bonus
      const basePoints = 100;
      const speedBonus = Math.max(0, 60 - timeTaken);
      const streakBonus = streak * 25;
      const totalGained = basePoints + speedBonus + streakBonus;

      const newScore = score + totalGained;
      const newStreak = streak + 1;
      const newBestStreak = Math.max(bestStreak, newStreak);
      const newHighScore = Math.max(highScore, newScore);

      // Award 1 free hint every 5 consecutive correct answers (capped at MAX_HINTS = 3)
      const isStreakMilestone = newStreak > 0 && newStreak % 5 === 0;
      const isBonusHintEarned = isStreakMilestone && hintsRemaining < MAX_HINTS;
      if (isBonusHintEarned) {
        setHintsRemaining(prev => Math.min(MAX_HINTS, prev + 1));
        sound.playSparkle();
      }

      // Decrement skip cooldown if active
      if (skipCooldown > 0) {
        setSkipCooldown(prev => Math.max(0, prev - 1));
      }

      setScore(newScore);
      setHighScore(newHighScore);
      setStreak(newStreak);
      setBestStreak(newBestStreak);
      setLastAddedScore(totalGained);
      setEarnedFreeHintThisRound(isBonusHintEarned);
      setFeedbackError(null);
      setIsCelebrationOpen(true);
    } else {
      // Incorrect answer
      sound.playError();
      setShakeKey(prev => prev + 1);
      setFeedbackError(res.errorDetail || 'คำตอบยังไม่ถูกต้อง ลองใหม่อีกครั้ง');
    }
  };

  // Handle skipping the puzzle (resets streak to 0, sets 5-round cooldown)
  const handleSkipPuzzle = () => {
    if (skipCooldown > 0) {
      sound.playError();
      setFeedbackError(`ปุ่มข้ามกำลังติดคูลดาวน์ (ต้องเล่นผ่านอีก ${skipCooldown} ข้อถึงจะใช้ได้)`);
      return;
    }
    sound.playClick();
    setStreak(0);
    setSkipCooldown(5);
    setExpression('');
    startNewRound(false);
    setFeedbackError(null);
  };

  // Handle revealing the solution
  const handleRevealSolution = () => {
    if (hintsRemaining > 0) {
      sound.playClick();
      setHintsRemaining(prev => Math.max(0, prev - 1));
      setIsSolutionOpen(true);
      setFeedbackError(null);
    } else if (score >= HINT_COST) {
      sound.playSparkle();
      setScore(prev => prev - HINT_COST);
      setIsSolutionOpen(true);
      setFeedbackError(null);
    } else {
      sound.playError();
      setFeedbackError(`สิทธิ์เฉลยหมดแล้ว ต้องใช้ ${HINT_COST} แต้มเพื่อดูเฉลย (คุณมี ${score.toLocaleString()} แต้ม)`);
    }
  };

  // Handle purchasing extra hints with score
  const handleBuyHint = () => {
    if (hintsRemaining >= MAX_HINTS) {
      sound.playError();
      setFeedbackError(`สิทธิ์ดูเฉลยเต็มแล้ว (สะสมได้สูงสุดไม่เกิน ${MAX_HINTS} ครั้ง)`);
      return;
    }
    if (score >= HINT_COST) {
      sound.playSparkle();
      setScore(prev => prev - HINT_COST);
      setHintsRemaining(prev => Math.min(MAX_HINTS, prev + 1));
      setFeedbackError(null);
    } else {
      sound.playError();
      setFeedbackError(`คะแนนไม่เพียงพอ ต้องการ ${HINT_COST} แต้ม (คุณมี ${score.toLocaleString()} แต้ม)`);
    }
  };

  // Handle rerolling the numbers (limited to 1 time per round)
  const handleRerollNumbers = () => {
    if (rerollsRemaining <= 0) {
      sound.playError();
      setFeedbackError('คุณใช้สิทธิ์สุ่มตัวเลขใหม่ในตานี้ไปแล้ว (จำกัด 1 ครั้งต่อตา)');
      return;
    }
    sound.playClick();
    setRerollsRemaining(prev => Math.max(0, prev - 1));
    startNewRound(false);
  };

  // Handle applying a solution string from modal
  const handleApplySolution = (sol: string) => {
    sound.playCardPick();
    setExpression(sol.replace(/\s+/g, ''));
    setFeedbackError(null);
  };

  // Sound toggle
  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.isMuted = next;
    if (!next) sound.playClick();
  };

  // Keyboard support for desktop users
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input or modal is open
      if (isCelebrationOpen || isSolutionOpen || isRulesOpen) return;

      const key = e.key;

      if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].includes(key)) {
        const digit = parseInt(key, 10);
        // Check if this digit is one of the available numbers
        const currentUsed = usedCounts[digit] || 0;
        const totalInTarget = numbers.filter(n => n === digit).length;
        if (currentUsed < totalInTarget) {
          handleCardClick(digit);
        } else {
          // If already used, still allow typing or show visual cue
          handleCardClick(digit);
        }
      } else if (['+', '-', '*', '/'].includes(key)) {
        e.preventDefault();
        handleInsertOperator(key);
      } else if (key === 'x' || key === 'X') {
        e.preventDefault();
        handleInsertOperator('*');
      } else if (['(', ')'].includes(key)) {
        e.preventDefault();
        handleInsertBracket(key);
      } else if (key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (key === 'Escape' || key === 'c' || key === 'C') {
        e.preventDefault();
        handleClear();
      } else if (key === 'Enter') {
        e.preventDefault();
        if (expression) {
          handleSubmitAnswer();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expression, numbers, usedCounts, isCelebrationOpen, isSolutionOpen, isRulesOpen]);

  return (
    <div className="min-h-screen bg-[#070d19] text-slate-100 flex flex-col justify-between selection:bg-blue-500/30 selection:text-blue-200 relative overflow-hidden font-['Plus_Jakarta_Sans','Prompt',sans-serif]">
      {/* Geometric Dot Grid Canvas Background with subtle sapphire blue tone */}
      <div
        className="fixed inset-0 opacity-[0.14] pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Ambient subtle light bursts with deep ocean & sapphire blue tones */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-40 w-[450px] h-[450px] bg-sky-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full flex flex-col flex-1 pb-4">
        {/* Header with Game Stats & Controls */}
        <Header
          score={score}
          streak={streak}
          bestStreak={bestStreak}
          round={round}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onOpenRules={() => setIsRulesOpen(true)}
          onNewGame={handleRerollNumbers}
          rerollsRemaining={rerollsRemaining}
          onSkip={handleSkipPuzzle}
          skipCooldown={skipCooldown}
        />

        {/* Main Game Arena */}
        <main className="w-full flex-1 flex flex-col justify-center gap-1 sm:gap-2">
          {/* Target 4 Number Cards */}
          <NumberCards
            numbers={numbers}
            usedCounts={usedCounts}
            onCardClick={handleCardClick}
          />

          {/* User Formula Display with Real-time evaluation */}
          <motion.div
            key={shakeKey}
            animate={shakeKey > 0 ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <ExpressionDisplay
              expression={expression}
              targetNumbers={numbers}
              onBackspace={handleBackspace}
            />
          </motion.div>

          {/* Feedback error alert if wrong */}
          {feedbackError && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-3xl mx-auto px-4"
            >
              <div className="p-3 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs sm:text-sm flex items-center justify-between gap-2 shadow-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{feedbackError}</span>
                </div>
                <button
                  onClick={() => setFeedbackError(null)}
                  className="text-rose-400 hover:text-rose-200 font-bold px-2 py-0.5"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          )}

          {/* Keypad with Operators, Solution button, and Submit button */}
          <Keypad
            onInsertOperator={handleInsertOperator}
            onInsertBracket={handleInsertBracket}
            onBackspace={handleBackspace}
            onClear={handleClear}
            onRevealSolution={handleRevealSolution}
            onSubmitAnswer={handleSubmitAnswer}
            canSubmit={Boolean(expression.trim())}
            hintsRemaining={hintsRemaining}
            score={score}
            hintCost={HINT_COST}
          />
        </main>

        {/* Geometric Balance Footer */}
        <footer className="w-full max-w-3xl mx-auto px-4 pt-3 flex items-center justify-between text-[11px] text-slate-500 font-mono tracking-wider">
          <div className="flex items-center gap-2">
            <span>© MMXXIV QUANT LOGIC</span>
            <span className="text-slate-700">/</span>
            <span>v2.0.4</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-400 uppercase">Engine Ready</span>
          </div>
        </footer>
      </div>

      {/* Modals */}
      {/* 1. Solution Modal ("เฉลย") */}
      <SolutionModal
        isOpen={isSolutionOpen}
        onClose={() => setIsSolutionOpen(false)}
        numbers={numbers}
        solutions={solutions}
        onApplySolution={handleApplySolution}
        onNewGame={handleRerollNumbers}
        hintsRemaining={hintsRemaining}
        score={score}
        hintCost={HINT_COST}
        onBuyHint={handleBuyHint}
        rerollsRemaining={rerollsRemaining}
      />

      {/* 2. Celebration Modal ("เมื่อตอบถูก ให้แสดงผลคะแนนและปุ่มเริ่มเกมใหม่") */}
      <CelebrationModal
        isOpen={isCelebrationOpen}
        score={score}
        addedScore={lastAddedScore}
        streak={streak}
        solvedExpression={expression}
        elapsedSeconds={elapsedSeconds}
        earnedFreeHint={earnedFreeHintThisRound}
        onNextGame={() => startNewRound(true)}
        onPlayAgainCurrent={() => {
          setIsCelebrationOpen(false);
          setExpression('');
        }}
      />

      {/* 3. Rules & How to play Modal */}
      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />
    </div>
  );
}
