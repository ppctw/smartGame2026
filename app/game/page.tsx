"use client";

import React from "react";
import { useGameContext } from "@/contexts/GameContextSocket";
import { GameBoard } from "@/components/GameBoard";
import { EventModal } from "@/components/EventModal";
import { WinScreen } from "@/components/WinScreen";

export default function GamePage() {
  const { gameState, closeEvent, resetGame } = useGameContext();

  if (!gameState.gameStarted) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #0a1929 0%, #1a2332 25%, #0d1b2a 50%, #1a2332 75%, #0a1929 100%)'
        }}
      >
        <div 
          className="text-center p-12 rounded-3xl border-2 border-cyan-500/50"
          style={{
            background: 'linear-gradient(135deg, #0c4a6e 0%, #075985 50%, #0c4a6e 100%)',
            boxShadow: '0 0 50px rgba(34, 211, 238, 0.5), inset 0 0 50px rgba(34, 211, 238, 0.1)'
          }}
        >
          <div className="text-8xl mb-6">🚂</div>
          <h1 
            className="text-5xl font-bold mb-4"
            style={{
              background: 'linear-gradient(90deg, #22d3ee 0%, #60a5fa 50%, #a78bfa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 20px rgba(34, 211, 238, 0.8))'
            }}
          >
            等待遊戲開始
          </h1>
          <p className="text-2xl text-cyan-200 mb-6">
            請在主控台設定隊伍並開始遊戲
          </p>
          <p className="text-lg text-cyan-400">
            主控台網址：<span className="font-mono text-cyan-300">http://localhost:3000</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="h-screen w-screen flex flex-col overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a1929 0%, #1a2332 25%, #0d1b2a 50%, #1a2332 75%, #0a1929 100%)'
      }}
    >
      <div className="flex-1 min-h-0 p-2 flex items-center justify-center">
        <GameBoard
          teams={gameState.teams}
          currentTeamIndex={gameState.currentTeamIndex}
        />
      </div>

      <EventModal
        show={gameState.showEvent}
        message={gameState.eventMessage}
        eventType={gameState.eventType}
        onClose={closeEvent}
      />

      <WinScreen winner={gameState.winner} onPlayAgain={resetGame} />
    </div>
  );
}
