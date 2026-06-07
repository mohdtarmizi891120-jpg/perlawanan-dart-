/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GameMode = 'X01' | 'Cricket';
export type CheckoutRule = 'single' | 'double' | 'master';
export type DoubleInRule = 'single' | 'double';

export interface MatchConfig {
  gameMode: GameMode;
  targetScore: number; // 301, 501, 701 etc.
  checkoutRule: CheckoutRule;
  doubleInRule: DoubleInRule;
  legsToWin: number;
}

export interface DartThrow {
  value: number; // 0 to 20, 25 for outer Bull, 50 for inner Bull, etc.
  multiplier: 1 | 2 | 3;
  label: string; // "S20", "D20", "T20", "BULL", "OBULL", "MISS"
}

export interface PlayerStats {
  ppr: number; // Points Per Round (average per 3 darts)
  first9Avg: number; // Average score of first 9 darts
  highestScore: number; // Single turn record
  count180: number;
  count140: number; // 140-179
  count100: number; // 100-139
  count60: number;  // 60-99
  totalDarts: number;
  totalScore: number;
}

export interface Player {
  id: string;
  name: string;
  legsWon: number;
  setsWon: number;
  currentScore: number; // Dynamic running score for X01
  startingScore: number; // Start score of the current leg
  history: Array<{
    legIndex: number;
    turns: Array<DartThrow[]>;
  }>;
  cricketScores: Record<number, number>; // Number (15-20, 25) -> Dart hits (0, 1, 2, 3+)
  stats: PlayerStats;
}

export interface MatchHistoryEntry {
  winnerId: string;
  winnerName: string;
  durationSeconds: number;
  playersSummary: Array<{
    name: string;
    legsWon: number;
    ppr: number;
  }>;
  date: string;
}
