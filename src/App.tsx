/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MatchConfig, Player, DartThrow, GameMode } from './types';
import { GameSettings } from './components/GameSettings';
import { ScoreBoard } from './components/ScoreBoard';
import { Dartboard } from './components/Dartboard';
import { audio } from './utils/audioHelper';
import { 
  Trophy, 
  HelpCircle, 
  Sparkles, 
  Tv2, 
  AlertTriangle, 
  RefreshCw, 
  Share2, 
  Volume2, 
  Info,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [lang, setLang] = useState<'ms' | 'en'>('ms');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  
  // Game state
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'winner'>('setup');
  const [config, setConfig] = useState<MatchConfig>({
    gameMode: 'X01',
    targetScore: 501,
    checkoutRule: 'double',
    doubleInRule: 'single',
    legsToWin: 3,
  });

  const [players, setPlayers] = useState<Player[]>([]);
  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);
  const [currentTurnThrows, setCurrentTurnThrows] = useState<DartThrow[]>([]);
  const [legsHistory, setLegsHistory] = useState<string[]>([]);
  
  // Winner overlay detail
  const [sessionWinner, setSessionWinner] = useState<Player | null>(null);

  // Bust state banner
  const [bustMessage, setBustMessage] = useState<boolean>(false);

  // Initialize audio preference
  useEffect(() => {
    audio.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // Handle Match Start
  const handleStartGame = (newConfig: MatchConfig, playerNames: string[]) => {
    const initializedPlayers: Player[] = playerNames.map((name, idx) => ({
      id: `plr-${idx}-${Date.now()}`,
      name,
      legsWon: 0,
      setsWon: 0,
      currentScore: newConfig.gameMode === 'X01' ? newConfig.targetScore : 0,
      startingScore: newConfig.gameMode === 'X01' ? newConfig.targetScore : 0,
      history: [],
      cricketScores: {
        15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0, 25: 0, // Bullseye tracks under key 25
      },
      stats: {
        ppr: 0,
        first9Avg: 0,
        highestScore: 0,
        count180: 0,
        count140: 0,
        count100: 0,
        count60: 0,
        totalDarts: 0,
        totalScore: 0,
      }
    }));

    setConfig(newConfig);
    setPlayers(initializedPlayers);
    setActivePlayerIndex(0);
    setCurrentTurnThrows([]);
    setLegsHistory([]);
    setBustMessage(false);
    setGameState('playing');
    
    if (soundEnabled) {
      audio.win(); // sweet startup chime
    }
  };

  // Switch to next player's turn
  const advanceToNextPlayer = (updatedPlayers: Player[]) => {
    setCurrentTurnThrows([]);
    setBustMessage(false);
    setPlayers(updatedPlayers);
    
    const nextIdx = (activePlayerIndex + 1) % updatedPlayers.length;
    setActivePlayerIndex(nextIdx);

    if (soundEnabled) {
      audio.turnSwitch();
    }
  };

  // Core scoring engine for standard X01 throwing
  const handleX01Throw = (thr: DartThrow) => {
    const activePlayer = players[activePlayerIndex];
    if (currentTurnThrows.length >= 3 || bustMessage) return;

    // Double In Check:
    // If double in rule is on, and their score is still targetScore, they must start with a double!
    const hasDoubledIn = activePlayer.currentScore < config.targetScore;
    let actualValue = thr.value * thr.multiplier;

    if (config.doubleInRule === 'double' && !hasDoubledIn) {
      // Must start with a double. (Bull is a double if it is inner bull, i.e. D_BULL, which has multiplier 2)
      // Standard rule: Double ring or Inner bull counts for Double-In.
      const isDouble = thr.multiplier === 2;
      if (!isDouble) {
        // Scores 0 points, but counts as a thrown dart
        actualValue = 0;
      }
    }

    // New prospective throw list
    const prospectiveThrows = [...currentTurnThrows, { ...thr, label: actualValue === 0 ? 'MISS' : thr.label }];
    const turnSum = prospectiveThrows.reduce((sum, d) => sum + d.value * d.multiplier, 0);
    const scoreRemaining = activePlayer.currentScore - turnSum;

    // Check Bust Conditions
    let isBust = false;

    if (scoreRemaining < 0) {
      isBust = true;
    } else if (scoreRemaining === 1) {
      // With Double-out or Master-out, reaching exactly 1 is impossible to checkout
      if (config.checkoutRule === 'double' || config.checkoutRule === 'master') {
        isBust = true;
      }
    } else if (scoreRemaining === 0) {
      if (config.checkoutRule === 'double') {
        // Reached exactly 0. Must be a double.
        const isDoubleWin = thr.multiplier === 2;
        if (!isDoubleWin) {
          isBust = true;
        }
      } else if (config.checkoutRule === 'master') {
        // Reached exactly 0. Must be double or triple.
        const isMasterWin = thr.multiplier >= 2;
        if (!isMasterWin) {
          isBust = true;
        }
      }
    }

    if (isBust) {
      if (soundEnabled) {
        audio.bust(); // Sad sliding tone sound
      }
      setBustMessage(true);
      // Revert turn scores completely
      const updatedPlayers = players.map((p, idx) => {
        if (idx !== activePlayerIndex) return p;
        
        // Add stats for thrown darts anyway (3 darts added)
        const updatedDarts = p.stats.totalDarts + 3;
        return {
          ...p,
          stats: {
            ...p.stats,
            totalDarts: updatedDarts,
            ppr: (p.stats.totalScore / updatedDarts) * 3,
          }
        };
      });

      // Quick toast message for bust, then skip turn after 2.2 seconds
      setTimeout(() => {
        advanceToNextPlayer(updatedPlayers);
      }, 2000);

      // Save the dummy throw visually
      setCurrentTurnThrows(prospectiveThrows);
      return;
    }

    // Play throw specific hit click
    if (soundEnabled) {
      audio.throwHit(thr.multiplier);
    }

    // Add throw to turn buffer
    const updatedThrows = [...currentTurnThrows, thr];
    setCurrentTurnThrows(updatedThrows);

    // Direct check for custom immediate checkout victory (no need to click submit)
    if (scoreRemaining === 0) {
      // Trigger instant victory flow!
      handleLegWin(activePlayerIndex, turnSum, updatedThrows);
    } else if (updatedThrows.length === 3) {
      // Auto-focus or alert turn complete. Players can review and hit "Sahkan Turn"
    }
  };

  // Score engine for Cricket throwing
  const handleCricketThrow = (thr: DartThrow) => {
    if (currentTurnThrows.length >= 3) return;

    const activePlayer = players[activePlayerIndex];
    const isTargetSector = [15, 16, 17, 18, 19, 20, 25].includes(thr.value);

    // If missed or not in target sectors, it registers as a hit with 0 points
    if (!isTargetSector) {
      if (soundEnabled) audio.throwHit(1);
      setCurrentTurnThrows([...currentTurnThrows, thr]);
      return;
    }

    if (soundEnabled) {
      audio.throwHit(thr.multiplier);
    }

    // Process cricket hits and potential scores
    const target = thr.value;
    const additionalHits = thr.multiplier;

    // Let's copy current board state
    const currentHits = activePlayer.cricketScores[target] || 0;
    const newHits = currentHits + additionalHits;

    // How many hits are used to close the number? (up to 3)
    const hitsToClose = Math.max(0, 3 - currentHits);
    const scoringMultipliers = Math.max(0, additionalHits - hitsToClose);

    let earnedPoints = 0;
    if (newHits > 3) {
      // Only score if at least one other player has NOT closed this number yet
      const anyoneElseNotClosed = players.some((p, idx) => {
        if (idx === activePlayerIndex) return false;
        return (p.cricketScores[target] || 0) < 3;
      });

      if (anyoneElseNotClosed) {
        // Hitting Bullseye outer/inner adds 25 or 50 points
        const pointsBase = target === 25 ? 25 : target;
        earnedPoints = scoringMultipliers * pointsBase;
      }
    }

    // Update player's immediate scores and stats inside a replica array
    const updatedPlayers = players.map((p, idx) => {
      if (idx !== activePlayerIndex) return p;

      const nextCricketScores = {
        ...p.cricketScores,
        [target]: Math.min(3, newHits), // visual caps at 3 hits on grid
      };

      return {
        ...p,
        currentScore: p.currentScore + earnedPoints,
        cricketScores: nextCricketScores,
      };
    });

    setPlayers(updatedPlayers);
    const updatedThrows = [...currentTurnThrows, thr];
    setCurrentTurnThrows(updatedThrows);

    // Verify Cricket victory check!
    // Condition: Active player has closed all targets (15-20, Bull) AND has equal or more points than anyone else.
    const activePlrState = updatedPlayers[activePlayerIndex];
    const hasClosedAll = [15, 16, 17, 18, 19, 20, 25].every(sec => (activePlrState.cricketScores[sec] || 0) >= 3);
    
    const isLeaderPoints = updatedPlayers.every(p => p.currentScore <= activePlrState.currentScore);

    if (hasClosedAll && isLeaderPoints) {
      // Player wins cricket match/leg!
      handleLegWin(activePlayerIndex, 0, updatedThrows, updatedPlayers);
    }
  };

  // Coordinate dart throw from Board or Keyboard
  const handleDartThrow = (thr: DartThrow) => {
    if (gameState !== 'playing' || bustMessage) return;

    if (config.gameMode === 'X01') {
      handleX01Throw(thr);
    } else {
      handleCricketThrow(thr);
    }
  };

  // Submit/Confirm current turn scores
  const handleSubmitTurn = () => {
    if (gameState !== 'playing' || currentTurnThrows.length === 0 || bustMessage) return;

    const activePlayer = players[activePlayerIndex];
    const turnSum = currentTurnThrows.reduce((sum, d) => sum + d.value * d.multiplier, 0);

    const updatedPlayers = players.map((p, idx) => {
      if (idx !== activePlayerIndex) return p;

      // Calculate stats updates
      const updatedTotalScore = p.stats.totalScore + turnSum;
      const updatedTotalDarts = p.stats.totalDarts + currentTurnThrows.length;
      
      const is180 = turnSum === 180;
      const is140 = turnSum >= 140 && turnSum < 180;
      const is100 = turnSum >= 100 && turnSum < 140;
      const is60 = turnSum >= 60 && turnSum < 100;

      const newStats = {
        ...p.stats,
        totalScore: updatedTotalScore,
        totalDarts: updatedTotalDarts,
        ppr: (updatedTotalScore / updatedTotalDarts) * 3,
        highestScore: Math.max(p.stats.highestScore, turnSum),
        count180: p.stats.count180 + (is180 ? 1 : 0),
        count140: p.stats.count140 + (is140 ? 1 : 0),
        count100: p.stats.count100 + (is100 ? 1 : 0),
        count60: p.stats.count60 + (is60 ? 1 : 0),
      };

      if (config.gameMode === 'X01') {
        const nextScore = Math.max(0, p.currentScore - turnSum);
        return {
          ...p,
          currentScore: nextScore,
          stats: newStats,
        };
      } else {
        // Cricket score subtraction not done here, score accumulated interactively
        return {
          ...p,
          stats: newStats,
        };
      }
    });

    advanceToNextPlayer(updatedPlayers);
  };

  // Undo the last throw in the current turn
  const handleUndoThrow = () => {
    if (currentTurnThrows.length === 0 || bustMessage) return;

    // In Cricket mode, since hits are registered in real-time, undo must subtract the hits and points back
    if (config.gameMode === 'Cricket') {
      const lastThr = currentTurnThrows[currentTurnThrows.length - 1];
      const activePlayer = players[activePlayerIndex];
      const target = lastThr.value;
      const isTargetSector = [15, 16, 17, 18, 19, 20, 25].includes(target);

      if (isTargetSector) {
        // We need to trace back target score reductions.
        // For simplicity, let's revert player state to before the last throw.
        // Let's do a quick reconstruction
        const previousHits = activePlayer.cricketScores[target] || 0;
        // Let's check how many hits were actually added
        const hitsAdded = lastThr.multiplier;
        
        // Let's find previous board hits
        // Since we visual cap at 3 hits, we check how many hits were added
        // It's much easier to implement undo safely by keeping states. Let's do a simple calculation:
        const hitsToClose = Math.max(0, 3 - (previousHits - hitsAdded)); // trace mathematically
        const scoringMultipliers = Math.max(0, hitsAdded - hitsToClose);
        const pointsBase = target === 25 ? 25 : target;
        const lastEarnedPoints = scoringMultipliers * pointsBase;

        const updatedPlayers = players.map((p, idx) => {
          if (idx !== activePlayerIndex) return p;
          
          const revertedHits = Math.max(0, previousHits - hitsAdded);
          return {
            ...p,
            currentScore: Math.max(0, p.currentScore - lastEarnedPoints),
            cricketScores: {
              ...p.cricketScores,
              [target]: revertedHits,
            }
          };
        });
        setPlayers(updatedPlayers);
      }
    }

    setCurrentTurnThrows(currentTurnThrows.slice(0, -1));
  };

  // Handles a win for the current Leg
  const handleLegWin = (playerIdx: number, turnSum: number, finalThrows: DartThrow[], forcedPlayers?: Player[]) => {
    if (soundEnabled) {
      audio.win();
    }

    const winningPlayer = (forcedPlayers || players)[playerIdx];
    const newLegsWon = winningPlayer.legsWon + 1;

    // Track log history
    const logMsg = lang === 'ms' 
      ? `Leg ${legsHistory.length + 1} dimenangi oleh ${winningPlayer.name} (PPR: ${winningPlayer.stats.ppr.toFixed(1)})`
      : `Leg ${legsHistory.length + 1} won by ${winningPlayer.name} (PPR: ${winningPlayer.stats.ppr.toFixed(1)})`;
    const nextHistory = [...legsHistory, logMsg];
    setLegsHistory(nextHistory);

    // Check if player has won the entire match!
    const hasWonMatch = newLegsWon >= config.legsToWin;

    if (hasWonMatch) {
      // Declare overall Winner
      setSessionWinner({
        ...winningPlayer,
        legsWon: newLegsWon,
      });
      setGameState('winner');
    } else {
      // Win currently, reset scores for a new Leg, but KEEP the Legs won statistics
      const resetPlayers = (forcedPlayers || players).map((p, idx) => {
        const isThisWinner = idx === playerIdx;
        return {
          ...p,
          legsWon: isThisWinner ? newLegsWon : p.legsWon,
          currentScore: config.gameMode === 'X01' ? config.targetScore : 0,
          startingScore: config.gameMode === 'X01' ? config.targetScore : 0,
          cricketScores: {
            15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0, 25: 0,
          },
        };
      });

      setPlayers(resetPlayers);
      setCurrentTurnThrows([]);
      setBustMessage(false);
      
      // Let standard player index cycle to the next launcher to start the new Leg
      const nextStarter = (playerIdx + 1) % resetPlayers.length;
      setActivePlayerIndex(nextStarter);

      // Simple visual notification
      alert(lang === 'ms' 
        ? `Leg berakhir! ${winningPlayer.name} memenangi Leg ini! Markah legs: ${winningPlayer.name} (${newLegsWon}).` 
        : `Leg finish! ${winningPlayer.name} wins this Leg! Leg score: ${winningPlayer.name} (${newLegsWon}).`
      );
    }
  };

  // Full Reset to go back to Setup panel
  const handleResetMatch = () => {
    setGameState('setup');
    setPlayers([]);
    setSessionWinner(null);
    setCurrentTurnThrows([]);
    setLegsHistory([]);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-between selection:bg-[#cfff00]/30 selection:text-[#cfff00]">
      
      {/* Visual Navigation Header */}
      <header className="border-b border-neutral-800 bg-[#0f0f0f] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#cfff00] flex items-center justify-center shadow">
              <Trophy className="w-5 h-5 text-black font-black" />
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-[0.3em] text-neutral-500 font-bold block mb-0.5">TOURNAMENT COUNTER</span>
              <h1 className="text-xl font-black tracking-tighter uppercase italic text-white leading-none">
                {lang === 'ms' ? 'Aplikasi Perlawanan Dart' : 'Dart Match Counter'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick sound toggle in header */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 hover:bg-neutral-800 rounded text-slate-400 hover:text-[#cfff00] transition"
              title={soundEnabled ? 'Mute' : 'Unmute'}
            >
              <Volume2 className={`w-4 h-4 ${!soundEnabled ? 'opacity-30' : ''}`} />
            </button>

            {/* Simple instruction button */}
            <span className="text-[10px] text-neutral-500 font-mono hidden sm:inline uppercase tracking-widest">
              UTC: 2026-06-07
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Arena */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 flex flex-col justify-center items-center">
        
        {/* Setup State */}
        {gameState === 'setup' && (
          <GameSettings 
            onStart={handleStartGame} 
            lang={lang} 
            setLang={setLang} 
          />
        )}

        {/* Active Playing Match State */}
        {gameState === 'playing' && (
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Play inputs left */}
            <div className="lg:col-span-5 space-y-4">
              <Dartboard onThrow={handleDartThrow} lang={lang} />
              
              {/* Bust Warning Notification */}
              <AnimatePresence>
                {bustMessage && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="p-4 bg-rose-950/20 border border-rose-800 rounded-lg flex items-center gap-3.5 shadow-lg"
                  >
                    <AlertTriangle className="w-6 h-6 text-rose-500 shrink-0 animate-bounce" />
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-tight text-rose-400">
                        {lang === 'ms' ? 'TERLEBIH SKOR (BUST)!' : 'BUST DETECTED!'}
                      </h4>
                      <p className="text-[11px] text-rose-500/90 mt-0.5">
                        {lang === 'ms' 
                          ? 'Mata melebihi baki atau sasaran tamat double tidak dipenuhi. Matikan giliran!'
                          : 'You exceeded the points or did not finish with a double. Skipping turn!'}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Active tournament statistics right */}
            <div className="lg:col-span-7">
              <ScoreBoard
                players={players}
                activePlayerIndex={activePlayerIndex}
                config={config}
                currentTurnThrows={currentTurnThrows}
                onSubmitTurn={handleSubmitTurn}
                onUndoThrow={handleUndoThrow}
                onResetMatch={handleResetMatch}
                lang={lang}
                soundEnabled={soundEnabled}
                onToggleSound={() => setSoundEnabled(!soundEnabled)}
                legsHistory={legsHistory}
              />
            </div>
          </div>
        )}

        {/* Winner Announcement Backdrop State */}
        {gameState === 'winner' && sessionWinner && (
          <div id="winner-banner" className="w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-none p-8 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-[#cfff00]/5 to-transparent opacity-60 pointer-events-none" />
            
            <div className="w-20 h-20 rounded-none bg-[#cfff00]/10 border border-[#cfff00]/20 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Trophy className="w-10 h-10 text-[#cfff00]" />
            </div>

            <span className="text-[10px] font-bold text-[#cfff00] uppercase tracking-[0.4em] block mb-2">
              {lang === 'ms' ? 'TAHNIAH! JUARA DIUMUMKAN' : 'CONGRATULATIONS! CHAMPION CROWNED'}
            </span>
            <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none mb-3">
              {sessionWinner.name}
            </h2>
            <p className="text-xs text-neutral-400 max-w-md mx-auto mb-6 leading-relaxed">
              {lang === 'ms' 
                ? `Telah berjaya memupuk gelaran dengan memenangi pusingan legs terbanyak dalam perlawanan ini.`
                : `Successfully claimed the Championship title by winning the required amount of legs in this tournament.`}
            </p>

            {/* Key stats capsule */}
            <div className="grid grid-cols-3 gap-2 bg-black p-4 border border-neutral-800 mb-6 text-left">
              <div>
                <span className="text-[9px] text-neutral-500 font-mono block uppercase tracking-wider">Legs Won</span>
                <span className="text-xl font-black text-white font-sans">{sessionWinner.legsWon}</span>
              </div>
              <div>
                <span className="text-[9px] text-neutral-500 font-mono block uppercase tracking-wider">Average PPR</span>
                <span className="text-xl font-black text-[#cfff00] font-sans">{sessionWinner.stats.ppr.toFixed(1)}</span>
              </div>
              <div>
                <span className="text-[9px] text-neutral-500 font-mono block uppercase tracking-wider">Darts Left</span>
                <span className="text-xl font-black text-white font-sans">{sessionWinner.stats.totalDarts}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleResetMatch}
                className="flex-1 py-3 px-5 bg-[#cfff00] text-black font-sans font-black uppercase tracking-tighter text-sm hover:bg-white transition cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 inline-block mr-1" />
                <span>{lang === 'ms' ? 'Main Sekali Lagi' : 'Play Again'}</span>
              </button>
              
              <button
                type="button"
                onClick={() => setGameState('setup')}
                className="flex-1 py-3 px-5 bg-neutral-850 hover:bg-neutral-800 border border-neutral-700 text-slate-200 font-sans font-bold text-xs uppercase tracking-wider transition cursor-pointer"
              >
                {lang === 'ms' ? 'Ubah Tetapan' : 'Back to Settings'}
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Rules Explainer Modal Footer */}
      <footer className="border-t border-neutral-800 bg-[#0a0a0a] py-6 text-center">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#cfff00] shrink-0" />
            <p className="text-[11px] text-neutral-500 text-left leading-normal uppercase tracking-wider">
              {lang === 'ms' 
                ? 'App dibina khas menggunakan standard PDC World Darts Championship. Sesuai untuk perlawanan 301, 501, dan Cricket tempatan.'
                : 'Built according to the official PDC World Darts rules. Suitable for local tournament tracking and pub dartboard counts.'}
            </p>
          </div>
          
          <div className="text-[10px] text-neutral-600 font-mono tracking-widest">
            ID: c28c155f • DART COUNTER v1.2
          </div>
        </div>
      </footer>
    </div>
  );
}
