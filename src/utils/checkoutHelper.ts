/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CheckoutRule } from '../types';

// Custom Checkout Combinations for double-out up to 170.
// Standard PDC reference suggestions.
export const CHECKOUT_MAP: Record<number, string[]> = {
  170: ['T20', 'T20', 'BULL'],
  167: ['T20', 'T19', 'BULL'],
  164: ['T20', 'T18', 'BULL'],
  161: ['T20', 'T17', 'BULL'],
  160: ['T20', 'T20', 'D20'],
  158: ['T20', 'T20', 'D19'],
  157: ['T20', 'T19', 'D20'],
  156: ['T20', 'T20', 'D18'],
  155: ['T20', 'T19', 'D19'],
  154: ['T20', 'T18', 'D20'],
  153: ['T20', 'T19', 'D18'],
  152: ['T20', 'T20', 'D16'],
  151: ['T20', 'T17', 'D20'],
  150: ['T20', 'T18', 'D18'],
  149: ['T20', 'T19', 'D16'],
  148: ['T20', 'T16', 'D20'],
  147: ['T20', 'T17', 'D18'],
  146: ['T20', 'T18', 'D16'],
  145: ['T20', 'T15', 'D20'],
  144: ['T20', 'T20', 'D12'],
  143: ['T20', 'T17', 'D16'],
  142: ['T20', 'T14', 'D20'],
  141: ['T20', 'T15', 'D18'],
  140: ['T20', 'T16', 'D16'],
  139: ['T20', 'T13', 'D20'],
  138: ['T20', 'T18', 'D12'],
  137: ['T19', 'T16', 'D16'],
  136: ['T20', 'T20', 'D8'],
  135: ['T20', 'T15', 'D15'],
  134: ['T20', 'T14', 'D16'],
  133: ['T20', 'T17', 'D10'],
  132: ['T20', 'T16', 'D12'],
  131: ['T20', 'T13', 'D16'],
  130: ['T20', 'T18', 'D8'],
  129: ['T19', 'T16', 'D12'],
  128: ['T18', 'T14', 'D16'],
  127: ['T20', 'T17', 'D8'],
  126: ['T19', 'T19', 'D6'],
  125: ['T20', 'T15', 'D10'],
  124: ['T20', 'T16', 'D8'],
  123: ['T19', 'T16', 'D9'],
  122: ['T18', 'T18', 'D7'],
  121: ['T20', 'T15', 'D8'],
  120: ['T20', 'S20', 'D20'],
  119: ['T19', 'S20', 'D21'], // alternative: T19, T10, D16
  118: ['T20', 'S18', 'D20'],
  117: ['T20', 'S17', 'D20'],
  116: ['T20', 'S16', 'D20'],
  115: ['T20', 'S15', 'D20'],
  114: ['T20', 'S14', 'D20'],
  113: ['T19', 'S16', 'D20'],
  112: ['T20', 'S12', 'D20'],
  111: ['T20', 'S11', 'D20'],
  110: ['T20', 'S10', 'D20'],
  109: ['T19', 'S12', 'D20'],
  108: ['T19', 'S11', 'D20'],
  107: ['T19', 'S10', 'D20'],
  106: ['T20', 'S10', 'D18'],
  105: ['T19', 'S8', 'D20'],
  104: ['T18', 'S10', 'D20'],
  103: ['T19', 'S10', 'D18'],
  102: ['T20', 'S10', 'D16'],
  101: ['T17', 'S10', 'D20'],
  100: ['T20', 'D20'],
  99: ['T19', 'S10', 'D16'],
  98: ['T20', 'D19'],
  97: ['T19', 'D20'],
  96: ['T20', 'D18'],
  95: ['T19', 'D19'],
  94: ['T18', 'D20'],
  93: ['T19', 'D18'],
  92: ['T20', 'D16'],
  91: ['T17', 'D20'],
  90: ['T18', 'D18'],
  89: ['T19', 'D16'],
  88: ['T16', 'D20'],
  87: ['T17', 'D18'],
  86: ['T18', 'D16'],
  85: ['T15', 'D20'],
  84: ['T20', 'D12'],
  83: ['T17', 'D16'],
  82: ['T14', 'D20'],
  81: ['T15', 'D18'],
  80: ['T20', 'D10'],
  79: ['T13', 'D20'],
  78: ['T18', 'D12'],
  77: ['T15', 'D16'],
  76: ['T20', 'D8'],
  75: ['T17', 'D12'],
  74: ['T14', 'D16'],
  73: ['T19', 'D8'],
  72: ['T16', 'D12'],
  71: ['T13', 'D16'],
  70: ['T18', 'D8'],
  69: ['T15', 'D12'],
  68: ['T16', 'D10'],
  67: ['T17', 'D8'],
  66: ['T14', 'D12'],
  65: ['T11', 'D16'],
  64: ['T16', 'D8'],
  63: ['T13', 'D12'],
  62: ['T10', 'D16'],
  61: ['T15', 'D8'],
  60: ['S20', 'D20'],
  59: ['S19', 'D20'],
  58: ['S18', 'D20'],
  57: ['S17', 'D20'],
  56: ['S16', 'D20'],
  55: ['S15', 'D20'],
  54: ['S14', 'D20'],
  53: ['S13', 'D20'],
  52: ['S12', 'D20'],
  51: ['S11', 'D20'],
  50: ['S10', 'D20'],
  49: ['S9', 'D20'],
  48: ['S16', 'D16'],
  47: ['S7', 'D20'],
  46: ['S14', 'D16'],
  45: ['S13', 'D16'],
  44: ['S12', 'D16'],
  43: ['S11', 'D16'],
  42: ['S10', 'D16'],
  41: ['S9', 'D16'],
  40: ['D20'],
  39: ['S7', 'D16'],
  38: ['D19'],
  37: ['S5', 'D16'],
  36: ['D18'],
  35: ['S3', 'D16'],
  34: ['D17'],
  33: ['S1', 'D16'],
  32: ['D16'],
  31: ['S15', 'D8'],
  30: ['D15'],
  29: ['S13', 'D8'],
  28: ['D14'],
  27: ['S11', 'D8'],
  26: ['D13'],
  25: ['S9', 'D8'],
  24: ['D12'],
  23: ['S7', 'D8'],
  22: ['D11'],
  21: ['S5', 'D8'],
  20: ['D10'],
  19: ['S3', 'D8'],
  18: ['D9'],
  17: ['S1', 'D8'],
  16: ['D8'],
  15: ['S7', 'D4'],
  14: ['D7'],
  13: ['S5', 'D4'],
  12: ['D6'],
  11: ['S3', 'D4'],
  10: ['D5'],
  9: ['S1', 'D4'],
  8: ['D4'],
  7: ['S3', 'D2'],
  6: ['D3'],
  5: ['S1', 'D2'],
  4: ['D2'],
  3: ['S1', 'D1'],
  2: ['D1'],
};

/**
 * Returns a recommended set of throws for a player to checkout if their score is <= 170.
 * Supported checkout types: 'double', 'single', or 'master' (double/triple/bull).
 */
export function getCheckoutSuggestion(score: number, checkoutRule: CheckoutRule): string[] | null {
  if (score > 170) return null;
  if (score <= 1) return null;

  if (checkoutRule === 'double') {
    return CHECKOUT_MAP[score] || null;
  }

  if (checkoutRule === 'single') {
    // Single checkout is extremely straightforward. We can do single throws until we hit 0.
    if (score <= 20) {
      return [`S${score}`];
    }
    if (score === 25) {
      return ['S_BULL']; // Outer bull
    }
    if (score === 50) {
      return ['D_BULL']; // Inner bull
    }

    // Otherwise, find a single throw to leave 0 or a number <= 20.
    if (score > 60) {
      return ['T20', ...getCheckoutSuggestion(score - 60, 'single') || []].slice(0, 3);
    } else if (score > 20) {
      // Find maximum single sector or double or triple
      if (score % 3 === 0 && score <= 60) {
        return [`T${score / 3}`];
      }
      if (score % 2 === 0 && score <= 40) {
        return [`D${score / 2}`];
      }
      // Leave a clean number
      const currentDart = Math.min(20, score - 1);
      const remainder = score - currentDart;
      return [`S${currentDart}`, ...getCheckoutSuggestion(remainder, 'single') || []].slice(0, 3);
    }
  }

  // Master out (Double, triple, or bull to finish)
  // Master out can use double out suggestions as a perfect subset
  if (checkoutRule === 'master') {
    if (CHECKOUT_MAP[score]) {
      return CHECKOUT_MAP[score];
    }
    // We can also finish with any Triple! E.g. 60 from T20
    if (score === 60) return ['T20'];
    if (score === 57) return ['T19'];
    if (score === 54) return ['T18'];
    if (score % 3 === 0 && score <= 60) {
      return [`T${score / 3}`];
    }
    return CHECKOUT_MAP[score] || null;
  }

  return null;
}
