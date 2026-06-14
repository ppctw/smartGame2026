"use client";

import React from "react";
import { useGameContext } from "@/contexts/GameContextSocket";
import { SetupScreen } from "@/components/SetupScreen";
import { ControlPanel } from "@/components/ControlPanel";
import { EventModal } from "@/components/EventModal";
import { WinScreen } from "@/components/WinScreen";

export default function Home() {
  const { gameState, startGame, closeEvent, resetGame } = useGameContext();

  if (!gameState.gameStarted) {
    return <SetupScreen onStart={startGame} />;
  }

  return (
    <div 
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #0a1929 0%, #1a2332 25%, #0d1b2a 50%, #1a2332 75%, #0a1929 100%)'
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 
            className="text-5xl font-bold mb-2"
            style={{
              background: 'linear-gradient(90deg, #22d3ee 0%, #60a5fa 50%, #a78bfa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 20px rgba(34, 211, 238, 0.5))'
            }}
          >
            🎮 主控台
          </h1>
          <p className="text-xl text-cyan-300">夢想探索號列車 - 主持人操作介面</p>
        </header>

        <div className="max-w-2xl mx-auto">
          <ControlPanel />
        </div>
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
