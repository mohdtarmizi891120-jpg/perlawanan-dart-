/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DartThrow } from '../types';
import { Target, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface DartboardProps {
  onThrow: (throwVal: DartThrow) => void;
  lang: 'ms' | 'en';
}

const SECTORS = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];

// Dimension Radii
const R_INNER_BULL = 10;
const R_OUTER_BULL = 22;
const R_INNER_SINGLE = 106;
const R_TRIPLE = 118;
const R_OUTER_SINGLE = 175;
const R_DOUBLE = 188;
const R_BOARD_OUTLINE = 194;
const R_NUMBERS = 216;

export const Dartboard: React.FC<DartboardProps> = ({ onThrow, lang }) => {
  const [hoverLabel, setHoverLabel] = useState<string>('');
  const [lastThrow, setLastThrow] = useState<string | null>(null);

  const cx = 240;
  const cy = 240;

  // Sound or flash trigger helper
  const handleSectorClick = (value: number, multiplier: 1 | 2 | 3, label: string) => {
    const item: DartThrow = { value, multiplier, label };
    setLastThrow(label);
    onThrow(item);
  };

  // Helper to generate SVG Arc Path
  const getArcPath = (
    cx: number,
    cy: number,
    rInner: number,
    rOuter: number,
    startDeg: number,
    endDeg: number
  ) => {
    const toRad = Math.PI / 180;
    const sRad = startDeg * toRad;
    const eRad = endDeg * toRad;

    const x1_inner = cx + rInner * Math.cos(sRad);
    const y1_inner = cy + rInner * Math.sin(sRad);
    const x2_inner = cx + rInner * Math.cos(eRad);
    const y2_inner = cy + rInner * Math.sin(eRad);

    const x1_outer = cx + rOuter * Math.cos(sRad);
    const y1_outer = cy + rOuter * Math.sin(sRad);
    const x2_outer = cx + rOuter * Math.cos(eRad);
    const y2_outer = cy + rOuter * Math.sin(eRad);

    return `
      M ${x1_outer} ${y1_outer}
      A ${rOuter} ${rOuter} 0 0 1 ${x2_outer} ${y2_outer}
      L ${x2_inner} ${y2_inner}
      A ${rInner} ${rInner} 0 0 0 ${x1_inner} ${y1_inner}
      Z
    `.trim();
  };

  // Helper for quick labels
  const getDisplayLabel = (val: number, mult: number) => {
    if (val === 25) {
      return mult === 2 ? 'DB (Double Bull - 50)' : 'SB (Single Bull - 25)';
    }
    const prefix = mult === 3 ? 'T' : mult === 2 ? 'D' : 'S';
    return `${prefix}${val} (${val * mult} mata)`;
  };

  return (
    <div id="dartboard-module" className="flex flex-col items-center justify-center p-4 bg-[#0f0f0f] border-2 border-neutral-800 rounded-none shadow-xl w-full max-w-lg mx-auto">
      {/* Visual Header */}
      <div className="flex justify-between items-center w-full mb-3 px-1">
        <div className="flex items-center gap-2 text-white">
          <Target className="w-5 h-5 text-[#cfff00]" />
          <span className="font-sans font-black uppercase tracking-tighter italic text-sm">
            {lang === 'ms' ? 'Papan Dart Digital' : 'Digital Dart Board'}
          </span>
        </div>
        <div className="text-[10px] font-mono font-black uppercase tracking-wider text-black bg-[#cfff00] px-2 py-1">
          {hoverLabel || (lastThrow ? `${lang === 'ms' ? 'Balingan' : 'Last Throw'}: ${lastThrow}` : `${lang === 'ms' ? 'Tekan papan untuk skor' : 'Tap board'}`)}
        </div>
      </div>

      {/* SVG Container */}
      <div className="relative w-full aspect-square max-w-[360px] md:max-w-[380px] bg-black rounded-full border border-neutral-800 p-1 flex items-center justify-center shadow-inner overflow-hidden select-none">
        <svg
          viewBox="0 0 480 480"
          className="w-full h-full cursor-pointer drop-shadow-2xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Black Outer Ring Background */}
          <circle cx={cx} cy={cy} r={R_BOARD_OUTLINE + 46} fill="#050505" stroke="#262626" strokeWidth="3" />
          <circle cx={cx} cy={cy} r={R_BOARD_OUTLINE} fill="#0d0d0d" stroke="#404040" strokeWidth="2" />

          {/* Render 20 Sectors */}
          {SECTORS.map((num, idx) => {
            // angle center for 20 is -90 degrees
            const centerAngle = -90 + idx * 18;
            const startAngle = centerAngle - 9;
            const endAngle = centerAngle + 9;

            // Alternating colors
            const isEven = idx % 2 === 0;
            const ringColor = isEven ? '#ef4444' : '#10b981'; // Red or Green for D/T
            const singleColor = isEven ? '#171717' : '#f5f5f5'; // Dark Slate or Off-white

            const doubleLabel = `D${num}`;
            const tripleLabel = `T${num}`;
            const outerSingleLabel = `S${num}`;
            const innerSingleLabel = `S${num}`;

            return (
              <g key={num}>
                {/* Outer Double Bed */}
                <path
                  d={getArcPath(cx, cy, R_OUTER_SINGLE, R_DOUBLE, startAngle, endAngle)}
                  fill={ringColor}
                  stroke="#404040"
                  strokeWidth="0.8"
                  className="transition-opacity hover:opacity-80 active:fill-amber-400"
                  onMouseEnter={() => setHoverLabel(getDisplayLabel(num, 2))}
                  onMouseLeave={() => setHoverLabel('')}
                  onClick={() => handleSectorClick(num, 2, doubleLabel)}
                />

                {/* Outer Single Bed */}
                <path
                  d={getArcPath(cx, cy, R_TRIPLE, R_OUTER_SINGLE, startAngle, endAngle)}
                  fill={singleColor}
                  className="transition-opacity hover:opacity-80 active:fill-amber-400"
                  stroke="#404040"
                  strokeWidth="0.8"
                  onMouseEnter={() => setHoverLabel(getDisplayLabel(num, 1))}
                  onMouseLeave={() => setHoverLabel('')}
                  onClick={() => handleSectorClick(num, 1, outerSingleLabel)}
                />

                {/* Triple Bed */}
                <path
                  d={getArcPath(cx, cy, R_INNER_SINGLE, R_TRIPLE, startAngle, endAngle)}
                  fill={ringColor}
                  className="transition-opacity hover:opacity-80 active:fill-amber-400"
                  stroke="#404040"
                  strokeWidth="0.8"
                  onMouseEnter={() => setHoverLabel(getDisplayLabel(num, 3))}
                  onMouseLeave={() => setHoverLabel('')}
                  onClick={() => handleSectorClick(num, 3, tripleLabel)}
                />

                {/* Inner Single Bed */}
                <path
                  d={getArcPath(cx, cy, R_OUTER_BULL, R_INNER_SINGLE, startAngle, endAngle)}
                  fill={singleColor}
                  className="transition-opacity hover:opacity-80 active:fill-amber-400"
                  stroke="#404040"
                  strokeWidth="0.8"
                  onMouseEnter={() => setHoverLabel(getDisplayLabel(num, 1))}
                  onMouseLeave={() => setHoverLabel('')}
                  onClick={() => handleSectorClick(num, 1, innerSingleLabel)}
                />

                {/* Number text displayed around the ring */}
                {(() => {
                  const labelAngleRad = (centerAngle * Math.PI) / 180;
                  const textX = cx + R_NUMBERS * Math.cos(labelAngleRad);
                  const textY = cy + R_NUMBERS * Math.sin(labelAngleRad) + 5; // offset slightly for vertical centering
                  return (
                    <text
                      x={textX}
                      y={textY}
                      textAnchor="middle"
                      fill="#e5e5e5"
                      fontWeight="900"
                      fontSize="20"
                      fontFamily="'Space Grotesk', 'Inter', sans-serif"
                      className="pointer-events-none select-none text-slate-100"
                    >
                      {num}
                    </text>
                  );
                })()}
              </g>
            );
          })}

          {/* Outer Bull (Single Bull, 25 points, Green) */}
          <circle
            cx={cx}
            cy={cy}
            r={R_OUTER_BULL}
            fill="#10b981"
            stroke="#404040"
            strokeWidth="0.8"
            className="transition-opacity hover:opacity-80 active:fill-amber-400"
            onMouseEnter={() => setHoverLabel(getDisplayLabel(25, 1))}
            onMouseLeave={() => setHoverLabel('')}
            onClick={() => handleSectorClick(25, 1, 'BULL')}
          />

          {/* Inner Bull (Double Bull, 50 points, Red) */}
          <circle
            cx={cx}
            cy={cy}
            r={R_INNER_BULL}
            fill="#ef4444"
            className="transition-opacity hover:opacity-80 active:fill-amber-400 font-sans"
            onMouseEnter={() => setHoverLabel(getDisplayLabel(25, 2))}
            onMouseLeave={() => setHoverLabel('')}
            onClick={() => handleSectorClick(25, 2, 'D_BULL')}
          />
        </svg>
      </div>

      {/* Misses Button */}
      <div className="grid grid-cols-2 gap-2.5 w-full mt-3">
        <button
          id="btn-miss-dart"
          type="button"
          onClick={() => handleSectorClick(0, 1, 'MISS')}
          className="flex justify-center items-center py-2.5 px-3 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-white font-sans text-xs font-black uppercase tracking-tighter transition cursor-pointer rounded-none"
        >
          {lang === 'ms' ? '🎯 Balingan Luar / Miss' : '🎯 Miss Throw'}
        </button>

        <button
          id="btn-outer-bull-quick"
          type="button"
          onClick={() => handleSectorClick(25, 1, 'BULL')}
          className="flex justify-center items-center py-2.5 px-3 bg-[#cfff00]/10 border border-[#cfff00]/30 text-[#cfff00] font-sans text-xs font-black uppercase tracking-tighter transition cursor-pointer rounded-none hover:bg-[#cfff00] hover:text-black"
        >
          {lang === 'ms' ? 'Outer Bull (25 pt)' : 'Outer Bull (25 pt)'}
        </button>
      </div>

      {/* Manual Input Grid / Papan Butang Pantas */}
      <div className="w-full mt-4 pt-4 border-t border-neutral-800">
        <p className="text-[10px] font-mono font-black text-neutral-400 mb-2.5 flex items-center gap-1.5 uppercase tracking-[0.2em]">
          <HelpCircle className="w-3.5 h-3.5 text-[#cfff00]" />
          {lang === 'ms' ? 'Butang Pantas (Telefon / Grid)' : 'Quick Buttons (Grid Input)'}
        </p>

        {/* Dynamic target list */}
        <div className="grid grid-cols-5 gap-1 w-full">
          {[20, 19, 18, 17, 16, 15, 11, 12, 13, 14].map((num) => (
            <div key={num} className="flex flex-col gap-1 bg-black p-1 border border-neutral-900 rounded-none">
              <span className="text-[10px] text-[#cfff00] text-center font-mono font-black italic">{num}</span>
              <div className="grid grid-cols-3 gap-0.5">
                <button
                  onClick={() => handleSectorClick(num, 1, `S${num}`)}
                  className="bg-neutral-900 text-[9px] font-black text-neutral-300 py-1 text-center hover:bg-[#cfff00] hover:text-black transition cursor-pointer rounded-none"
                  title={`Single ${num}`}
                >
                  S
                </button>
                <button
                  onClick={() => handleSectorClick(num, 2, `D${num}`)}
                  className="bg-red-950/20 text-[9px] font-black text-red-500 py-1 text-center hover:bg-red-800 hover:text-white transition cursor-pointer rounded-none border border-red-950"
                  title={`Double ${num}`}
                >
                  D
                </button>
                <button
                  onClick={() => handleSectorClick(num, 3, `T${num}`)}
                  className="bg-emerald-950/20 text-[9px] font-black text-emerald-400 py-1 text-center hover:bg-emerald-800 hover:text-white transition cursor-pointer rounded-none border border-emerald-950"
                  title={`Triple ${num}`}
                >
                  T
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
