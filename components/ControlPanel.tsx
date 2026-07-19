"use client";

import React, { useState } from "react";
import { useGameContext } from "@/contexts/GameContextSocket";
import { DiceRoller } from "./DiceRoller";
import { TeamStatusPanel } from "./TeamStatusPanel";

export const ControlPanel: React.FC = () => {
  const { gameState, rollDice, resetGame, manualMove } = useGameContext();
  const [manualSteps, setManualSteps] = useState<number>(1);

  if (!gameState.gameStarted) {
    return null;
  }

  const currentTeam = gameState.teams[gameState.currentTeamIndex];

  const handleManualMove = () => {
    if (manualSteps >= 1 && manualSteps <= 6) {
      manualMove(manualSteps);
    }
  };

  return (
    <div className="space-y-6">
      <div 
        className="rounded-3xl shadow-2xl p-6 border-2 border-cyan-500/50"
        style={{
          background: 'linear-gradient(135deg, #0a1929 0%, #1a2332 50%, #0d1b2a 100%)',
          boxShadow: '0 0 30px rgba(34, 211, 238, 0.3), inset 0 0 30px rgba(34, 211, 238, 0.1)'
        }}
      >
        <h2 className="text-3xl font-bold mb-4 text-cyan-300 text-center drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
          當前回合
        </h2>
        {currentTeam && (
          <div
            className="p-6 rounded-2xl mb-6 text-center border-2 border-cyan-400/50"
            style={{ 
              backgroundColor: currentTeam.color,
              boxShadow: '0 0 20px rgba(34, 211, 238, 0.5)'
            }}
          >
            <div className="mx-auto mb-2 h-20 w-20 overflow-hidden rounded-full border-2 border-white text-5xl drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
              {currentTeam.image ? (
                <span
                  className="block h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${currentTeam.image})` }}
                />
              ) : (
                currentTeam.emoji
              )}
            </div>
            <div className="text-3xl font-bold text-white drop-shadow-lg">
              {currentTeam.name}
            </div>
            <div className="text-xl text-white mt-2">
              目前在第 {currentTeam.position} 格
            </div>
          </div>
        )}

        <DiceRoller
          diceValue={gameState.diceValue}
          isRolling={gameState.isRolling}
          onRoll={rollDice}
          disabled={gameState.showEvent || !!gameState.winner}
        />

        <div className="mt-6 pt-6 border-t-2 border-cyan-500/30">
          <h3 className="text-xl font-bold mb-3 text-cyan-300 text-center">
            手動移動
          </h3>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              max="6"
              value={manualSteps}
              onChange={(e) => setManualSteps(Number(e.target.value))}
              className="flex-1 px-4 py-3 rounded-xl text-lg font-bold text-center border-2 border-cyan-500/50 text-white"
              style={{
                background: 'linear-gradient(135deg, #0a1929 0%, #0d1b2a 100%)',
                boxShadow: '0 0 10px rgba(34, 211, 238, 0.2)'
              }}
              disabled={gameState.showEvent || !!gameState.winner || gameState.isRolling}
            />
            <button
              onClick={handleManualMove}
              disabled={gameState.showEvent || !!gameState.winner || gameState.isRolling}
              className="px-6 py-3 rounded-xl border-2 font-bold text-lg transition-all duration-200"
              style={
                gameState.showEvent || gameState.winner || gameState.isRolling
                  ? {
                      background: '#374151',
                      borderColor: '#4b5563',
                      color: '#9ca3af',
                      cursor: 'not-allowed'
                    }
                  : {
                      background: 'linear-gradient(135deg, #0c4a6e 0%, #075985 100%)',
                      borderColor: 'rgba(34, 211, 238, 0.5)',
                      color: '#22d3ee',
                      boxShadow: '0 0 15px rgba(34, 211, 238, 0.3)'
                    }
              }
            >
              前進
            </button>
          </div>
          <div className="mt-2 flex gap-2 justify-center">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                onClick={() => setManualSteps(num)}
                className={`w-10 h-10 rounded-lg border-2 font-bold transition-all ${
                  manualSteps === num
                    ? 'border-cyan-400 text-white scale-110'
                    : 'border-cyan-600/50 text-cyan-400'
                }`}
                style={
                  manualSteps === num
                    ? {
                        background: 'linear-gradient(135deg, #0c4a6e 0%, #075985 100%)',
                        boxShadow: '0 0 15px rgba(34, 211, 238, 0.5)'
                      }
                    : {
                        background: 'linear-gradient(135deg, #0a1929 0%, #0d1b2a 100%)'
                      }
                }
                disabled={gameState.showEvent || !!gameState.winner || gameState.isRolling}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>

      <TeamStatusPanel
        teams={gameState.teams}
        currentTeamIndex={gameState.currentTeamIndex}
      />

      <div className="space-y-3">
        <a
          href="/game"
          target="_blank"
          rel="noopener noreferrer"
          className="
            block w-full px-6 py-4 rounded-xl border-2 border-cyan-500/50
            font-bold text-lg text-cyan-300 text-center
            transition-all duration-200 hover:scale-105
          "
          style={{
            background: 'linear-gradient(135deg, #0c4a6e 0%, #075985 100%)',
            boxShadow: '0 0 15px rgba(34, 211, 238, 0.3)'
          }}
        >
          🖥️ 開啟投影畫面
        </a>

        <button
          onClick={resetGame}
          className="
            w-full px-6 py-4 rounded-xl border-2 border-cyan-500/50
            font-bold text-lg text-cyan-300
            transition-all duration-200 hover:scale-105
          "
          style={{
            background: 'linear-gradient(135deg, #0a1929 0%, #1a2332 100%)',
            boxShadow: '0 0 15px rgba(34, 211, 238, 0.3)'
          }}
        >
          重新開始
        </button>
      </div>
    </div>
  );
};
