/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MatchConfig, Player, CheckoutRule, DoubleInRule, GameMode } from '../types';
import { UserPlus, Trash, ChevronRight, Settings, Users, Trophy } from 'lucide-react';

interface GameSettingsProps {
  onStart: (config: MatchConfig, players: string[]) => void;
  lang: 'ms' | 'en';
  setLang: (l: 'ms' | 'en') => void;
}

export const GameSettings: React.FC<GameSettingsProps> = ({ onStart, lang, setLang }) => {
  const [gameMode, setGameMode] = useState<GameMode>('X01');
  const [targetScore, setTargetScore] = useState<number>(501);
  const [checkoutRule, setCheckoutRule] = useState<CheckoutRule>('double');
  const [doubleInRule, setDoubleInRule] = useState<DoubleInRule>('single');
  const [legsToWin, setLegsToWin] = useState<number>(1);
  const [players, setPlayers] = useState<string[]>([
    lang === 'ms' ? 'Pemain 1' : 'Player 1',
    lang === 'ms' ? 'Pemain 2' : 'Player 2',
  ]);
  const [newPlayerName, setNewPlayerName] = useState<string>('');

  const handleAddPlayer = () => {
    const trimmed = newPlayerName.trim();
    if (trimmed && players.length < 8) {
      setPlayers([...players, trimmed]);
      setNewPlayerName('');
    }
  };

  const handleRemovePlayer = (idx: number) => {
    if (players.length > 1) {
      setPlayers(players.filter((_, i) => i !== idx));
    }
  };

  const handleStartGame = () => {
    const config: MatchConfig = {
      gameMode,
      targetScore,
      checkoutRule,
      doubleInRule,
      legsToWin,
    };
    onStart(config, players);
  };

  return (
    <div id="settings-pnl" className="w-full max-w-2xl mx-auto bg-[#0f0f0f] border-2 border-neutral-800 rounded-none p-6 shadow-2xl relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#cfff00]/5 rounded-none blur-3xl pointer-events-none" />

      {/* Header section with Language Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings className="w-5 h-5 text-[#cfff00]" />
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] font-mono text-[#cfff00]">
              {lang === 'ms' ? 'Tetapan Permainan' : 'Match Configuration'}
            </span>
          </div>
          <h1 className="text-3xl font-black font-sans text-white uppercase tracking-tighter italic">
            {lang === 'ms' ? 'Konfigurasi Perlawanan' : 'Dart Match Settings'}
          </h1>
        </div>

        <div className="flex gap-1 p-1 bg-black rounded-none border border-neutral-800">
          <button
            type="button"
            onClick={() => setLang('ms')}
            className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-none transition ${
              lang === 'ms' ? 'bg-[#cfff00] text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            MELAYU
          </button>
          <button
            type="button"
            onClick={() => setLang('en')}
            className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-none transition ${
              lang === 'en' ? 'bg-[#cfff00] text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            ENGLISH
          </button>
        </div>
      </div>

      {/* Mode & Rule Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        
        {/* Game Mode selection */}
        <div className="space-y-4">
          <div className="bg-black p-4 rounded-none border border-neutral-800 space-y-3">
            <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 font-mono">
              {lang === 'ms' ? '1. Format Permainan' : '1. Game Format'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGameMode('X01')}
                className={`py-3 px-4 rounded-none border transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  gameMode === 'X01'
                    ? 'bg-[#cfff00] border-[#cfff00] text-black font-black'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-700'
                }`}
              >
                <span className="text-sm font-black uppercase tracking-tight">X01 Game</span>
                <span className="text-[9px] font-mono opacity-80 font-normal">301, 501, 701</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setGameMode('Cricket');
                  setTargetScore(0);
                }}
                className={`py-3 px-4 rounded-none border transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  gameMode === 'Cricket'
                    ? 'bg-[#cfff00] border-[#cfff00] text-black font-black'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-700'
                }`}
              >
                <span className="text-sm font-black uppercase tracking-tight">Cricket</span>
                <span className="text-[9px] font-mono opacity-80 font-normal">15-20, Bull</span>
              </button>
            </div>
          </div>

          {gameMode === 'X01' && (
            <div className="bg-black p-4 rounded-none border border-neutral-800 space-y-3">
              <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 font-mono">
                {lang === 'ms' ? '2. Jumlah Poin Mula' : '2. Starter Score Points'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[301, 501, 701].map((pts) => (
                  <button
                    key={pts}
                    type="button"
                    onClick={() => setTargetScore(pts)}
                    className={`py-2 px-3 rounded-none font-bold text-xs border transition cursor-pointer ${
                      targetScore === pts
                        ? 'bg-[#cfff00]/20 border-[#cfff00] text-[#cfff00]'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
                    }`}
                  >
                    {pts}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Checkout & Double In settings */}
          {gameMode === 'X01' && (
            <div className="bg-black p-4 rounded-none border border-neutral-800 space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 font-mono block mb-2">
                  {lang === 'ms' ? '3. Syarat Tamat (Checkout Rule)' : '3. Checkout Rules'}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['single', 'double', 'master'] as CheckoutRule[]).map((rule) => (
                    <button
                      key={rule}
                      type="button"
                      onClick={() => setCheckoutRule(rule)}
                      className={`py-1.5 px-2 rounded-none font-black text-[10px] uppercase border transition cursor-pointer ${
                        checkoutRule === rule
                          ? 'bg-[#cfff00]/10 border-[#cfff00] text-[#cfff00]'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
                      }`}
                    >
                      {rule === 'single' ? (lang === 'ms' ? 'S' : 'Single') : rule === 'double' ? (lang === 'ms' ? 'D' : 'Double') : (lang === 'ms' ? 'M' : 'Master')} Out
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-neutral-500 mt-1.5 leading-normal uppercase">
                  {checkoutRule === 'double' 
                    ? (lang === 'ms' ? 'Mesti tamat dengan menembak sektor Double atau Bullseye sahaja.' : 'Must finish with a double segment or bullseye.')
                    : checkoutRule === 'master'
                    ? (lang === 'ms' ? 'Boleh tamat dengan mencatatkan Triple, Double, atau Bullseye.' : 'Can finish with double, triple, or bullseye.')
                    : (lang === 'ms' ? 'Boleh tamat dengan sebarang balingan tunggal biasa.' : 'Can finish on any sector to reach exactly 0.')}
                </p>
              </div>

              <div className="border-t border-neutral-800 pt-3">
                <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 font-mono block mb-2">
                  {lang === 'ms' ? '4. Syarat Mula (Double In Rule)' : '4. Double In Rule'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['single', 'double'] as DoubleInRule[]).map((rule) => (
                    <button
                      key={rule}
                      type="button"
                      onClick={() => setDoubleInRule(rule)}
                      className={`py-1.5 px-3 rounded-none font-black text-[10px] uppercase border transition cursor-pointer ${
                        doubleInRule === rule
                          ? 'bg-neutral-800 border-neutral-700 text-white'
                          : 'bg-neutral-950 border-neutral-900 text-neutral-500 hover:bg-[#0c0c0c]'
                      }`}
                    >
                      {rule === 'single' ? (lang === 'ms' ? 'Biasa' : 'Single In') : (lang === 'ms' ? 'Mesti Mula D' : 'Double In')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Legs configuration */}
          <div className="bg-black p-4 rounded-none border border-neutral-800 space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 font-mono flex justify-between">
              <span>{lang === 'ms' ? 'Legs Kemenangan' : 'Legs To Win'}</span>
              <span className="text-[#cfff00] font-black">{legsToWin} leg(s)</span>
            </label>
            <input
              type="range"
              min="1"
              max="11"
              step="2"
              value={legsToWin}
              onChange={(e) => setLegsToWin(parseInt(e.target.value))}
              className="w-full accent-[#cfff00] bg-neutral-800 h-1 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-neutral-500 font-mono">
              <span>Best of 1</span>
              <span>Best of 5</span>
              <span>Best of 9</span>
              <span>Best of 21</span>
            </div>
          </div>
        </div>

        {/* Players Add/Remove Lists */}
        <div className="bg-black p-5 rounded-none border border-neutral-800 flex flex-col h-full">
          <div className="flex items-center gap-1.5 mb-3">
            <Users className="w-4 h-4 text-[#cfff00]" />
            <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 font-mono">
              {lang === 'ms' ? 'Senarai Pemain' : 'Players List'} ({players.length})
            </label>
          </div>

          {/* Add player form */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddPlayer();
                }
              }}
              placeholder={lang === 'ms' ? 'Nama Pemain...' : 'Player Name...'}
              maxLength={15}
              className="flex-1 bg-neutral-900 border border-neutral-800 rounded-none px-3 py-2 text-xs uppercase font-bold text-slate-200 placeholder-neutral-600 focus:outline-none focus:border-[#cfff00]"
            />
            <button
              type="button"
              onClick={handleAddPlayer}
              className="bg-[#cfff00] text-black font-black px-4 py-2 rounded-none transition flex items-center justify-center cursor-pointer hover:bg-white"
            >
              <UserPlus className="w-4 h-4" />
            </button>
          </div>

          {/* List display */}
          <div className="flex-1 overflow-y-auto space-y-1 max-h-[220px] pr-1 scrollbar-thin scrollbar-thumb-neutral-800">
            {players.map((p, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-[#0a0a0a] px-3.5 py-2.5 rounded-none border border-neutral-900 hover:border-neutral-800 transition"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 bg-neutral-850 text-[9px] text-neutral-400 flex items-center justify-center font-bold font-mono border border-neutral-800">
                    {idx + 1}
                  </span>
                  <span className="text-xs uppercase font-bold tracking-tight text-neutral-200">{p}</span>
                </div>

                {players.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePlayer(idx)}
                    className="text-neutral-500 hover:text-red-400 p-1 transition cursor-pointer"
                    title="Buang Pemain"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center gap-2 bg-[#cfff00]/5 p-2.5 rounded-none border-l-2 border-[#cfff00]">
            <Trophy className="w-4 h-4 text-[#cfff00] shrink-0" />
            <p className="text-[10px] text-neutral-400 leading-snug uppercase tracking-wider">
              {lang === 'ms' 
                ? 'Tip: Pemenang ditentukan setelah melengkapkan sasaran set atau leg yang dikonfigurasi.'
                : 'Tip: Winners will be declared once they completely finish their X01 score according to selected rules!'}
            </p>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <button
        id="btn-start-game"
        type="button"
        onClick={handleStartGame}
        className="w-full bg-[#cfff00] text-black font-black py-4 px-6 rounded-none transition duration-150 uppercase tracking-tighter text-sm flex items-center justify-center gap-2 hover:bg-white cursor-pointer shadow-lg"
      >
        <span>{lang === 'ms' ? 'Mulakan Perlawanan' : 'Start Match Now'}</span>
        <ChevronRight className="w-5 h-5 stroke-[3px]" />
      </button>
    </div>
  );
};
