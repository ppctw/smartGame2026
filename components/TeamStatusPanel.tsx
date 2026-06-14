import React from "react";
import { Team } from "@/types/game";

interface TeamStatusPanelProps {
  teams: Team[];
  currentTeamIndex: number;
}

export const TeamStatusPanel: React.FC<TeamStatusPanelProps> = ({
  teams,
  currentTeamIndex,
}) => {
  return (
    <div 
      className="rounded-xl shadow-lg p-6 border-2 border-cyan-500/50"
      style={{
        background: 'linear-gradient(135deg, #0a1929 0%, #1a2332 50%, #0d1b2a 100%)',
        boxShadow: '0 0 30px rgba(34, 211, 238, 0.3), inset 0 0 30px rgba(34, 211, 238, 0.1)'
      }}
    >
      <h3 className="text-2xl font-bold mb-4 text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
        隊伍狀態
      </h3>
      <div className="space-y-3">
        {teams.map((team, index) => (
          <div
            key={team.id}
            className={`
              p-4 rounded-lg border-2 transition-all
              ${
                index === currentTeamIndex
                  ? "border-cyan-400 scale-105"
                  : "border-cyan-600/30"
              }
            `}
            style={{
              background: index === currentTeamIndex
                ? 'linear-gradient(135deg, #0c4a6e 0%, #075985 100%)'
                : 'linear-gradient(135deg, #0a1929 0%, #0d1b2a 100%)',
              boxShadow: index === currentTeamIndex
                ? '0 0 20px rgba(34, 211, 238, 0.5)'
                : '0 0 10px rgba(34, 211, 238, 0.2)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-2xl border-2 border-white"
                  style={{ 
                    backgroundColor: team.color,
                    boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
                  }}
                >
                  {team.emoji}
                </div>
                <div>
                  <div className="font-bold text-lg text-white">{team.name}</div>
                  <div className="text-sm text-cyan-300">
                    第 {team.position} 格
                    {team.isResting && " (休息中)"}
                  </div>
                </div>
              </div>
              {index === currentTeamIndex && (
                <div className="text-2xl animate-pulse drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">👈</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
