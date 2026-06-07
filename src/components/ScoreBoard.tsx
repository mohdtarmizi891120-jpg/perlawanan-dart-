/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Player, MatchConfig, DartThrow } from '../types';
import { getCheckoutSuggestion } from '../utils/checkoutHelper';
import { Trophy, RotateCcw, AlertCircle, ArrowRight, Zap, ListCollapse, Volume2, VolumeX, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ScoreBoardProps {
  players: Player[];
  activePlayerIndex: number;
  config: MatchConfig;
  currentTurnThrows: DartThrow[];
  onSubmitTurn: () => void;
  onUndoThrow: () => void;
  onResetMatch: () => void;
  lang: 'ms' | 'en';
  soundEnabled: boolean;
  onToggleSound: () => void;
  legsHistory: string[];
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  players,
  activePlayerIndex,
  config,
  currentTurnThrows,
  onSubmitTurn,
  onUndoThrow,
  onResetMatch,
  lang,
  soundEnabled,
  onToggleSound,
  legsHistory,
}) => {
  const [showFullStats, setShowFullStats] = useState<boolean>(false);
  const activePlayer = players[activePlayerIndex];

  // Calculate sub-score for the active turn
  const turnScore = currentTurnThrows.reduce((sum, d) => sum + d.value * d.multiplier, 0);

  // Suggested checkouts
  const checkouts = activePlayer && config.gameMode === 'X01' 
    ? getCheckoutSuggestion(activePlayer.currentScore - turnScore, config.checkoutRule)
    : null;

  // Sound/Mute styling
  const SpeakerIcon = soundEnabled ? Volume2 : VolumeX;

  // Helper to render Cricket status symbols:
  // 0 : empty, 1 : "/", 2 : "X", 3+ : "⨂"
  const renderCricketSymbol = (count: number) => {
    if (count === 0) return <span className="text-slate-700 font-mono">-</span>;
    if (count === 1) return <span className="text-emerald-500 font-mono text-lg font-black">/</span>;
    if (count === 2) return <span className="text-amber-500 font-mono text-lg font-black">X</span>;
    return (
      <span className="relative flex items-center justify-center">
        <span className="text-rose-500 font-mono text-lg font-black">⨂</span>
      </span>
    );
  };

  return (
    <div id="scoreboard-module" className="space-y-4 w-full">
      
      {/* Top bar indicators */}
      <div className="flex justify-between items-center bg-[#0f0f0f] p-3 rounded-none border border-neutral-800">
        <div className="flex items-center gap-2">
          <SpeakerIcon 
            onClick={onToggleSound}
            className="w-5 h-5 text-neutral-400 hover:text-[#cfff00] cursor-pointer transition"
            title={soundEnabled ? 'Mute' : 'Unmute'}
          >
            <Volume2 className="w-4 h-4" />
          </SpeakerIcon>
          <div className="text-xs font-semibold">
            {config.gameMode === 'X01' ? (
              <span className="bg-neutral-900 text-[#cfff00] px-2.5 py-0.5 border border-neutral-800 font-mono text-[10px] font-bold">
                {config.targetScore} ({config.checkoutRule.toUpperCase()} OUT)
              </span>
            ) : (
              <span className="bg-neutral-900 text-[#cfff00] px-2.5 py-0.5 border border-neutral-800 font-mono text-[10px] font-bold">
                CRICKET MODE
              </span>
            )}
          </div>
          <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest font-bold">
            {lang === 'ms' ? `Hingga ${config.legsToWin} Legs` : `Best of ${config.legsToWin} Legs`}
          </span>
        </div>

        <button
          type="button"
          onClick={onResetMatch}
          className="text-[11px] text-neutral-500 hover:text-[#cfff00] font-bold uppercase tracking-wider flex items-center gap-1 transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{lang === 'ms' ? 'Sediakan Baru' : 'Reset Match'}</span>
        </button>
      </div>

      {/* Main Scoring Center */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Active Player Card & Turn Dashboard */}
        <div className="md:col-span-8 bg-[#0f0f0f] border-2 border-neutral-800 rounded-none p-5 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-[#cfff00]/5 to-transparent pointer-events-none" />
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#cfff00] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#cfff00]"></span>
              </span>
              <span className="text-[10px] font-bold text-[#cfff00] tracking-[0.2em] uppercase font-mono">
                {lang === 'ms' ? 'Gilirannya Semasa' : 'Active Turn'}
              </span>
            </div>
            
            <div className="text-xs font-bold uppercase tracking-tight text-neutral-400">
              {lang === 'ms' ? 'Pemain' : 'Player'}: <strong className="text-white italic">{activePlayer?.name}</strong>
            </div>
          </div>

          {/* Huge score indicator */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            
            {/* Running Left / Current Score display */}
            <div>
              {config.gameMode === 'X01' ? (
                <div>
                  <p className="text-6xl font-black font-sans text-white tracking-tighter italic leading-none flex items-baseline gap-1">
                    {Math.max(0, activePlayer?.currentScore - turnScore)}
                    <span className="text-[10px] text-[#cfff00] font-mono tracking-widest font-black uppercase">baki</span>
                  </p>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mt-2">
                    {lang === 'ms' ? 'Mata Asal' : 'Start score'}: <strong className="text-neutral-300 font-mono">{activePlayer?.currentScore}</strong>
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-6xl font-black font-sans text-[#cfff00] tracking-tighter italic leading-none flex items-baseline gap-1">
                    {activePlayer?.currentScore || 0}
                    <span className="text-[10px] text-neutral-400 font-mono tracking-widest font-black uppercase">poin</span>
                  </p>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mt-2">
                    {lang === 'ms' ? 'Tutup semua & mata tinggi' : 'Close targets & score highest'}
                  </p>
                </div>
              )}
            </div>

            {/* Throw summary points */}
            <div className="bg-black p-4 rounded-none border border-neutral-800 flex flex-col justify-between h-full min-h-[110px]">
              <div className="flex justify-between items-center border-b border-neutral-900 pb-1.5 mb-1.5">
                <span className="text-[10px] font-bold tracking-widest text-[#cfff00] uppercase font-mono">{lang === 'ms' ? 'Jumlah Turn' : 'Turn Sum'}</span>
                <span className="text-xl font-black text-white font-mono">+{turnScore}</span>
              </div>

              {/* Three slots for throws */}
              <div className="grid grid-cols-3 gap-1.5 animate-subtle">
                {[0, 1, 2].map((idx) => {
                  const thr = currentTurnThrows[idx];
                  return (
                    <div
                      key={idx}
                      className={`h-11 rounded-none border flex flex-col items-center justify-center transition-all ${
                        thr
                          ? 'bg-[#111] border-neutral-700'
                          : idx === currentTurnThrows.length
                          ? 'bg-[#cfff00]/5 border-[#cfff00] animate-pulse'
                          : 'bg-black border-neutral-900'
                      }`}
                    >
                      {thr ? (
                        <>
                          <span className="text-neutral-500 text-[9px] font-mono font-black italic tracking-wider uppercase leading-none mb-0.5">
                            {thr.label}
                          </span>
                          <span className="text-xs font-mono font-black text-white leading-none">
                            {thr.value * thr.multiplier}
                          </span>
                        </>
                      ) : (
                        <span className="text-[9px] text-neutral-700 font-mono font-bold">DART {idx + 1}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Checkout Suggestion Banner */}
          <AnimatePresence>
            {config.gameMode === 'X01' && checkouts && checkouts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="mt-4 p-3 bg-black border-l-4 border-[#cfff00] border-y border-r border-neutral-800 rounded-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#cfff00]" />
                  <span className="text-[10px] uppercase font-black tracking-widest text-neutral-200">
                    {lang === 'ms' ? 'KOMBINASI CHECKOUT SUGARAN:' : 'CHECKOUT FORMULA SUGGESTION:'}
                  </span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {checkouts.map((dart, i) => (
                    <span 
                      key={i} 
                      className="px-2.5 py-0.5 bg-[#1a1a1a] text-white font-mono text-[11px] font-black tracking-widest border border-neutral-700 uppercase"
                    >
                      {dart}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Row */}
          <div className="mt-5 pt-4 border-t border-neutral-800 flex flex-wrap gap-2 justify-between">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onUndoThrow}
                disabled={currentTurnThrows.length === 0}
                className="px-4 py-2.5 rounded-none bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-white font-sans uppercase font-black tracking-tighter text-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
              >
                <RotateCcw className="w-3.5 h-3.5 stroke-[3px]" />
                <span>{lang === 'ms' ? 'Padam Dart' : 'Undo Dart'}</span>
              </button>
            </div>

            <button
              onClick={onSubmitTurn}
              disabled={currentTurnThrows.length === 0}
              className="px-6 py-2.5 rounded-none bg-[#cfff00] hover:bg-white text-black text-xs font-black uppercase tracking-tighter transition flex items-center gap-2 cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
            >
              <span>{lang === 'ms' ? 'Sahkan Turn' : 'Confirm Turn'}</span>
              <ArrowRight className="w-4 h-4 stroke-[3px]" />
            </button>
          </div>
        </div>

        {/* Global Standings Leaderboard in Right rail */}
        <div className="md:col-span-4 bg-[#0f0f0f] border-2 border-neutral-800 rounded-none p-4 flex flex-col justify-between shadow-xl">
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono flex items-center justify-between mb-2">
              <span>{lang === 'ms' ? 'KEDUDUKAN PEMAIN' : 'LEADERBOARD'}</span>
              <Trophy className="w-4 h-4 text-[#cfff00]" />
            </h3>

            <div className="space-y-1.5">
              {players.map((plr, i) => {
                const isActive = i === activePlayerIndex;
                return (
                  <div
                    key={plr.id}
                    className={`p-3 rounded-none border transition-all relative ${
                      isActive
                        ? 'bg-neutral-900 border-[#cfff00]'
                        : 'bg-black border-neutral-900 hover:border-neutral-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 ${isActive ? 'bg-[#cfff00] animate-pulse' : 'bg-neutral-800'}`} />
                        <span className={`text-xs uppercase font-black tracking-tight truncate max-w-[100px] ${isActive ? 'text-[#cfff00]' : 'text-neutral-300'}`}>
                          {plr.name}
                        </span>
                        {plr.legsWon > 0 && (
                          <span className="bg-neutral-900 text-[#cfff00] text-[9px] font-black border border-neutral-800 px-1.5 py-0.2 font-mono flex items-center gap-0.5">
                            <Trophy className="w-2.5 h-2.5 shrink-0" />
                            {plr.legsWon}L
                          </span>
                        )}
                      </div>

                      {config.gameMode === 'X01' ? (
                        <span className="text-sm font-sans font-black italic tracking-tighter text-white">
                          {plr.currentScore}
                        </span>
                      ) : (
                        <span className="text-sm font-sans font-black italic tracking-tighter text-[#cfff00]">
                          {plr.currentScore} PTS
                        </span>
                      )}
                    </div>

                    {/* Simple PPR Stats bar */}
                    <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-neutral-500 mt-1.5 pt-1.5 border-t border-neutral-900">
                      <span>PPR: <strong className="text-neutral-300">{plr.stats.ppr.toFixed(1)}</strong></span>
                      <span>DARTS: <strong className="text-neutral-300">{plr.stats.totalDarts}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowFullStats(!showFullStats)}
            className="w-full mt-3 py-2 bg-neutral-950 hover:bg-neutral-900 rounded-none text-[9px] uppercase tracking-widest font-black text-neutral-400 border border-neutral-800 transition flex items-center justify-center gap-1 cursor-pointer"
          >
            <ListCollapse className="w-3.5 h-3.5 text-[#cfff00]" />
            <span>{showFullStats ? (lang === 'ms' ? 'Sembunyi Statistik' : 'Hide Statistics') : (lang === 'ms' ? 'Urus & Lihat Statistik' : 'Manage & View Statistics')}</span>
          </button>
        </div>

      </div>

      {/* Cricket Game State Grid block (Show ONLY in Cricket mode) */}
      {config.gameMode === 'Cricket' && (
        <div className="bg-[#0f0f0f] border-2 border-neutral-800 rounded-none p-5 shadow-xl overflow-x-auto">
          <div className="flex justify-between mb-4 pb-2 border-b border-neutral-800">
            <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">
              {lang === 'ms' ? 'STATUS SASARAN CRICKET (15-20, BULL)' : 'CRICKET GRID SCOREBOARD'}
            </h3>
            <span className="text-[9px] text-neutral-500 font-mono tracking-wider">HITS: 1=/, 2=X, 3+=⨂</span>
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-neutral-900 text-[10px] uppercase tracking-widest text-neutral-500 font-mono">
                <th className="py-2 text-left">{lang === 'ms' ? 'Sektor' : 'Target'}</th>
                {players.map((p) => (
                  <th key={p.id} className="py-2 text-center truncate px-2 text-[10px] font-bold text-white uppercase">{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[20, 19, 18, 17, 16, 15, 25].map((sector) => (
                <tr key={sector} className="border-b border-neutral-900 hover:bg-black/40 text-xs">
                  <td className="py-2.5 font-black font-sans text-neutral-300 uppercase">
                    {sector === 25 ? 'BULL' : sector}
                  </td>
                  {players.map((p) => (
                    <td key={p.id} className="py-2 text-center text-sm font-black text-white">
                      {renderCricketSymbol(p.cricketScores[sector] || 0)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Full Statistics Expansion Panel */}
      <AnimatePresence>
        {showFullStats && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#0f0f0f] border-2 border-neutral-800 rounded-none p-5 shadow-xl space-y-4 overflow-hidden"
          >
            <div className="pb-2 border-b border-neutral-800">
              <h3 className="text-xs font-black uppercase tracking-wider text-white">
                {lang === 'ms' ? 'Statistik Kejohanan Terperinci' : 'Detailed Tournament Standings'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {players.map((plr) => (
                <div key={plr.id} className="bg-black p-4 border border-neutral-900 space-y-2">
                  <div className="flex justify-between items-center border-b border-neutral-900 pb-1.5">
                    <span className="font-black text-[#cfff00] text-sm uppercase tracking-tight">{plr.name}</span>
                    <span className="text-[10px] font-mono font-bold text-white border border-neutral-800 px-2 py-0.5">
                      Legs Won: {plr.legsWon}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono tracking-wider uppercase">
                    <div className="p-2 bg-neutral-950 border border-neutral-900">
                      <span className="text-neutral-500 block text-[9px] mb-0.5 font-bold">POINTS PER ROUND</span>
                      <span className="text-white text-xs font-black">{plr.stats.ppr.toFixed(1)}</span>
                    </div>

                    <div className="p-2 bg-neutral-950 border border-neutral-900">
                      <span className="text-neutral-500 block text-[9px] mb-0.5 font-bold">HIGHEST TURN SCORE</span>
                      <span className="text-[#cfff00] text-xs font-black">{plr.stats.highestScore}</span>
                    </div>

                    <div className="p-2 bg-neutral-950 border border-neutral-900">
                      <span className="text-neutral-500 block text-[9px] mb-0.5 font-bold">DARTS THROWN</span>
                      <span className="text-white text-xs font-black">{plr.stats.totalDarts}</span>
                    </div>

                    <div className="p-2 bg-neutral-950 border border-neutral-900 flex flex-col justify-between">
                      <div>
                        <span className="text-neutral-500 block text-[9px] mb-0.5 font-bold">TON RECORD</span>
                        <span className="text-white text-[10px] font-black">180s: {plr.stats.count180}</span>
                      </div>
                      <div className="text-[10px] text-neutral-400 mt-1">
                        <div>140+: {plr.stats.count140}</div>
                        <div>100+: {plr.stats.count100}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {legsHistory.length > 0 && (
              <div className="pt-3 border-t border-neutral-850">
                <span className="text-[10px] font-black text-neutral-400 block mb-2 font-mono uppercase tracking-widest">
                  {lang === 'ms' ? 'Sejarah Rekod Legs' : 'Legs Log History'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {legsHistory.map((item, idx) => (
                    <span key={idx} className="bg-black font-mono text-[9px] font-bold px-2 py-1 border border-neutral-900 text-neutral-400">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
