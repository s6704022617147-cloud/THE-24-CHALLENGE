/**
 * 24 Game Solver, Generator, and Evaluator
 */

export class Fraction {
  num: number;
  den: number;

  constructor(num: number, den: number = 1) {
    if (den === 0) {
      throw new Error('Division by zero');
    }
    // simplify fraction
    const g = Fraction.gcd(Math.abs(num), Math.abs(den));
    const sign = den < 0 ? -1 : 1;
    this.num = (num / g) * sign;
    this.den = Math.abs(den / g);
  }

  static gcd(a: number, b: number): number {
    return b === 0 ? a : Fraction.gcd(b, a % b);
  }

  add(other: Fraction): Fraction {
    return new Fraction(this.num * other.den + other.num * this.den, this.den * other.den);
  }

  sub(other: Fraction): Fraction {
    return new Fraction(this.num * other.den - other.num * this.den, this.den * other.den);
  }

  mul(other: Fraction): Fraction {
    return new Fraction(this.num * other.num, this.den * other.den);
  }

  div(other: Fraction): Fraction | null {
    if (other.num === 0) return null;
    return new Fraction(this.num * other.den, this.den * other.num);
  }

  equals(target: number): boolean {
    return this.den !== 0 && this.num === target * this.den;
  }

  toNumber(): number {
    return this.num / this.den;
  }
}

type OpType = '+' | '-' | '*' | '/';
const OPS: OpType[] = ['+', '-', '*', '/'];

function applyOp(a: Fraction, b: Fraction, op: OpType): Fraction | null {
  try {
    switch (op) {
      case '+': return a.add(b);
      case '-': return a.sub(b);
      case '*': return a.mul(b);
      case '/': return a.div(b);
    }
  } catch {
    return null;
  }
}

function getPermutations<T>(arr: T[]): T[][] {
  if (arr.length <= 1) return [arr];
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i++) {
    const current = arr[i];
    const remaining = [...arr.slice(0, i), ...arr.slice(i + 1)];
    const perms = getPermutations(remaining);
    for (const p of perms) {
      result.push([current, ...p]);
    }
  }
  return result;
}

export interface SolutionTree {
  expression: string;
  hasFractions: boolean;
}

/**
 * Solves the 24 game for 4 numbers.
 * Returns array of formatted distinct mathematical solutions.
 */
export function solve24(numbers: number[]): string[] {
  if (numbers.length !== 4) return [];

  const found = new Set<string>();
  const solutions: string[] = [];

  // Get unique permutations of the 4 numbers
  const perms = getPermutations([0, 1, 2, 3]);
  const seenPerms = new Set<string>();
  const uniquePerms: number[][] = [];

  for (const p of perms) {
    const key = p.map(idx => numbers[idx]).join(',');
    if (!seenPerms.has(key)) {
      seenPerms.add(key);
      uniquePerms.push(p.map(idx => numbers[idx]));
    }
  }

  for (const [a, b, c, d] of uniquePerms) {
    const fa = new Fraction(a);
    const fb = new Fraction(b);
    const fc = new Fraction(c);
    const fd = new Fraction(d);

    for (const op1 of OPS) {
      for (const op2 of OPS) {
        for (const op3 of OPS) {
          // Structure 1: ((a op1 b) op2 c) op3 d
          const r1_1 = applyOp(fa, fb, op1);
          if (r1_1) {
            const r1_2 = applyOp(r1_1, fc, op2);
            if (r1_2) {
              const r1_3 = applyOp(r1_2, fd, op3);
              if (r1_3 && r1_3.equals(24)) {
                const expr = `((${a} ${op1} ${b}) ${op2} ${c}) ${op3} ${d}`;
                addSolution(expr, found, solutions);
              }
            }
          }

          // Structure 2: (a op1 (b op2 c)) op3 d
          const r2_1 = applyOp(fb, fc, op2);
          if (r2_1) {
            const r2_2 = applyOp(fa, r2_1, op1);
            if (r2_2) {
              const r2_3 = applyOp(r2_2, fd, op3);
              if (r2_3 && r2_3.equals(24)) {
                const expr = `(${a} ${op1} (${b} ${op2} ${c})) ${op3} ${d}`;
                addSolution(expr, found, solutions);
              }
            }
          }

          // Structure 3: a op1 ((b op2 c) op3 d)
          const r3_1 = applyOp(fb, fc, op2);
          if (r3_1) {
            const r3_2 = applyOp(r3_1, fd, op3);
            if (r3_2) {
              const r3_3 = applyOp(fa, r3_2, op1);
              if (r3_3 && r3_3.equals(24)) {
                const expr = `${a} ${op1} ((${b} ${op2} ${c}) ${op3} ${d})`;
                addSolution(expr, found, solutions);
              }
            }
          }

          // Structure 4: a op1 (b op2 (c op3 d))
          const r4_1 = applyOp(fc, fd, op3);
          if (r4_1) {
            const r4_2 = applyOp(fb, r4_1, op2);
            if (r4_2) {
              const r4_3 = applyOp(fa, r4_2, op1);
              if (r4_3 && r4_3.equals(24)) {
                const expr = `${a} ${op1} (${b} ${op2} (${c} ${op3} ${d}))`;
                addSolution(expr, found, solutions);
              }
            }
          }

          // Structure 5: (a op1 b) op3 (c op2 d)
          const r5_1 = applyOp(fa, fb, op1);
          const r5_2 = applyOp(fc, fd, op2);
          if (r5_1 && r5_2) {
            const r5_3 = applyOp(r5_1, r5_2, op3);
            if (r5_3 && r5_3.equals(24)) {
              const expr = `(${a} ${op1} ${b}) ${op3} (${c} ${op2} ${d})`;
              addSolution(expr, found, solutions);
            }
          }
        }
      }
    }
  }

  // Format and clean up redundant outer brackets
  const cleaned = solutions.map(cleanExpression);
  const uniqueCleaned = Array.from(new Set(cleaned));
  return uniqueCleanCleanedSolutions(uniqueCleaned);
}

function addSolution(expr: string, found: Set<string>, list: string[]) {
  const norm = normalizeExpression(expr);
  if (!found.has(norm)) {
    found.add(norm);
    list.push(expr);
  }
}

function normalizeExpression(expr: string): string {
  return expr.replace(/\s+/g, '');
}

function cleanExpression(expr: string): string {
  // Replace * with × and / with ÷ for beautiful display if needed, but keep standard
  return expr;
}

function uniqueCleanCleanedSolutions(solutions: string[]): string[] {
  // Return sorted so simplest formulas come first
  return solutions.sort((a, b) => {
    // Fewer brackets first
    const aBrackets = (a.match(/\(/g) || []).length;
    const bBrackets = (b.match(/\(/g) || []).length;
    if (aBrackets !== bBrackets) return aBrackets - bBrackets;
    return a.length - b.length;
  });
}

/**
 * Generate a random set of 4 numbers (1-9 or 1-13) that is guaranteed to have at least one solution.
 */
export function generate24Puzzle(maxNum: number = 9): { numbers: number[]; solutions: string[] } {
  let attempts = 0;
  while (attempts < 500) {
    attempts++;
    const nums = [
      Math.floor(Math.random() * maxNum) + 1,
      Math.floor(Math.random() * maxNum) + 1,
      Math.floor(Math.random() * maxNum) + 1,
      Math.floor(Math.random() * maxNum) + 1,
    ];

    const solutions = solve24(nums);
    if (solutions.length > 0) {
      return { numbers: nums, solutions };
    }
  }

  // Fallback guaranteed set: [3, 8, 3, 8] -> 8 / (3 - 8/3) = 24 or [1, 2, 3, 4] -> (1+2+3)*4
  return {
    numbers: [1, 2, 3, 4],
    solutions: solve24([1, 2, 3, 4]),
  };
}

/**
 * Safe math expression evaluator using token stream / recursive descent.
 * Does NOT use evil eval().
 */
export function evaluateMathExpression(expression: string): {
  val: number;
  hasDivisionByZero: boolean;
} | null {
  const sanitized = expression.replace(/\s+/g, '');
  if (!sanitized) return null;

  let pos = 0;

  function peek(): string {
    return sanitized[pos] || '';
  }

  function get(): string {
    return sanitized[pos++] || '';
  }

  function parseExpression(): Fraction | null {
    let result = parseTerm();
    if (!result) return null;

    while (peek() === '+' || peek() === '-') {
      const op = get();
      const right = parseTerm();
      if (!right) return null;
      if (op === '+') {
        result = result.add(right);
      } else {
        result = result.sub(right);
      }
    }
    return result;
  }

  function parseTerm(): Fraction | null {
    let result = parseFactor();
    if (!result) return null;

    while (peek() === '*' || peek() === '×' || peek() === '/' || peek() === '÷') {
      const opChar = get();
      const op = (opChar === '×' ? '*' : opChar === '÷' ? '/' : opChar) as '*' | '/';
      const right = parseFactor();
      if (!right) return null;
      if (op === '*') {
        result = result.mul(right);
      } else {
        const divRes = result.div(right);
        if (divRes === null) {
          throw new Error('DIV_ZERO');
        }
        result = divRes;
      }
    }
    return result;
  }

  function parseFactor(): Fraction | null {
    if (peek() === '(') {
      get(); // consume '('
      const result = parseExpression();
      if (!result) return null;
      if (peek() === ')') {
        get(); // consume ')'
      } else {
        return null; // missing closing bracket
      }
      return result;
    }

    if (peek() === '-') {
      get(); // negative number unary
      const factor = parseFactor();
      if (!factor) return null;
      return new Fraction(-factor.num, factor.den);
    }

    // Number parsing
    let numStr = '';
    while (/[0-9.]/.test(peek())) {
      numStr += get();
    }

    if (!numStr) return null;
    const val = parseFloat(numStr);
    if (isNaN(val)) return null;

    // Convert decimal or integer to Fraction
    if (numStr.includes('.')) {
      const parts = numStr.split('.');
      const decimals = parts[1].length;
      const den = Math.pow(10, decimals);
      const num = Math.round(val * den);
      return new Fraction(num, den);
    }

    return new Fraction(val, 1);
  }

  try {
    const fraction = parseExpression();
    if (!fraction || pos !== sanitized.length) {
      return null;
    }
    return {
      val: fraction.toNumber(),
      hasDivisionByZero: false,
    };
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'DIV_ZERO') {
      return { val: NaN, hasDivisionByZero: true };
    }
    return null;
  }
}

/**
 * Checks if the user's expression satisfies all rules of Game 24:
 * 1. Valid syntax
 * 2. Uses all 4 target numbers exactly once (handles duplicates correctly)
 * 3. Result equals 24 (within floating precision or exact fraction)
 */
export function validateGame24Answer(
  expression: string,
  targetNumbers: number[]
): {
  isValidSyntax: boolean;
  value: number | null;
  displayValue: string;
  is24: boolean;
  usedNumbers: number[];
  isAllNumbersUsedExactlyOnce: boolean;
  errorDetail?: string;
} {
  // Extract all numbers used in expression
  // Match contiguous digits
  const tokens = expression.match(/\d+(\.\d+)?|[+\-*/×÷()]/g) || [];
  const numbersInExpr: number[] = [];

  for (const t of tokens) {
    if (/^\d+(\.\d+)?$/.test(t)) {
      numbersInExpr.push(parseFloat(t));
    }
  }

  // Count frequencies of target numbers vs used numbers
  const targetCounts = new Map<number, number>();
  for (const n of targetNumbers) {
    targetCounts.set(n, (targetCounts.get(n) || 0) + 1);
  }

  const usedCounts = new Map<number, number>();
  let hasForeignNumber = false;
  for (const n of numbersInExpr) {
    usedCounts.set(n, (usedCounts.get(n) || 0) + 1);
    if (!targetCounts.has(n)) {
      hasForeignNumber = true;
    }
  }

  // Check matching multi-set
  let exactMatch = numbersInExpr.length === targetNumbers.length && !hasForeignNumber;
  if (exactMatch) {
    for (const [n, count] of targetCounts.entries()) {
      if (usedCounts.get(n) !== count) {
        exactMatch = false;
        break;
      }
    }
  }

  // Evaluate
  const evalRes = evaluateMathExpression(expression);

  if (!evalRes) {
    return {
      isValidSyntax: false,
      value: null,
      displayValue: '—',
      is24: false,
      usedNumbers: numbersInExpr,
      isAllNumbersUsedExactlyOnce: exactMatch,
      errorDetail: 'สมการยังไม่สมบูรณ์ (ตรวจสอบวงเล็บหรือเครื่องหมาย)',
    };
  }

  if (evalRes.hasDivisionByZero || isNaN(evalRes.val) || !isFinite(evalRes.val)) {
    return {
      isValidSyntax: true,
      value: null,
      displayValue: 'หารด้วย 0 ไม่ได้',
      is24: false,
      usedNumbers: numbersInExpr,
      isAllNumbersUsedExactlyOnce: exactMatch,
      errorDetail: 'มีการหารด้วยศูนย์ ซึ่งไม่สามารถหาค่าได้',
    };
  }

  const val = evalRes.val;
  const is24 = Math.abs(val - 24) < 1e-7;
  const displayValue = Number.isInteger(val)
    ? val.toString()
    : Math.abs(val - Math.round(val)) < 1e-6
    ? Math.round(val).toString()
    : val.toFixed(2).replace(/\.?0+$/, '');

  let errorDetail: string | undefined = undefined;
  if (!exactMatch) {
    if (numbersInExpr.length < 4) {
      errorDetail = `ใช้ตัวเลขไปเพียง ${numbersInExpr.length} ตัว (ต้องใช้ครบ 4 ตัวพอดี)`;
    } else if (numbersInExpr.length > 4) {
      errorDetail = `ใช้ตัวเลขเกิน (${numbersInExpr.length} ตัว ต้องใช้ 4 ตัว)`;
    } else {
      errorDetail = 'ใช้ตัวเลขไม่ตรงกับโจทย์ที่กำหนดให้';
    }
  } else if (!is24) {
    errorDetail = `ผลลัพธ์คำนวณได้ ${displayValue} ยังไม่เท่ากับ 24`;
  }

  return {
    isValidSyntax: true,
    value: val,
    displayValue,
    is24: is24 && exactMatch,
    usedNumbers: numbersInExpr,
    isAllNumbersUsedExactlyOnce: exactMatch,
    errorDetail,
  };
}
