export type Operator = '+' | '-' | '*' | '/';

export type TokenType = 'number' | 'operator' | 'bracket';

export interface ExpressionToken {
  id: string;
  type: TokenType;
  value: string;
  cardIndex?: number; // 0, 1, 2, 3 pointing to which of the 4 drawn numbers
}

export interface GameState {
  numbers: number[]; // 4 numbers
  usedIndices: boolean[]; // whether numbers[i] is used in the expression
  tokens: ExpressionToken[];
  solutions: string[];
  score: number;
  highScore: number;
  streak: number;
  bestStreak: number;
  round: number;
  isSolved: boolean;
  revealedSolution: boolean;
  startTime: number;
  elapsedSeconds: number;
  message: {
    text: string;
    type: 'idle' | 'success' | 'error' | 'warning';
  };
}

export interface EvaluationResult {
  isValid: boolean;
  value: number | null;
  displayValue: string;
  is24: boolean;
  allUsed: boolean;
  missingIndices: number[];
  extraNumbers: number[];
  errorMessage?: string;
}

export type DifficultyMode = 'all' | 'easy' | 'medium' | 'hard';
