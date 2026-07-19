import React from "react";
import { Team } from "@/types/game";

interface WinScreenProps {
  winner: Team | null;
}

export const WinScreen: React.FC<WinScreenProps> = ({ winner }) => {
  if (!winner) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center z-50">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            {["🎉", "🎊", "⭐", "✨", "🎈"][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>

      <div className="relative bg-white rounded-3xl shadow-2xl p-16 max-w-3xl w-full mx-4 text-center">
        <div className="text-8xl mb-6 animate-bounce">🏆</div>
        
        <h1 className="text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          恭喜獲勝！
        </h1>

        <div
          className="inline-flex items-center gap-4 px-8 py-6 rounded-2xl mb-8"
          style={{ backgroundColor: winner.color }}
        >
          <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-white text-6xl">
            {winner.image ? (
              <span
                className="block h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${winner.image})` }}
              />
            ) : (
              winner.emoji
            )}
          </div>
          <div className="text-5xl font-bold text-white">{winner.name}</div>
        </div>

        <div className="text-3xl mb-12 text-gray-700">
          成功抵達夢夢車站！🎉
        </div>

      </div>
    </div>
  );
};
