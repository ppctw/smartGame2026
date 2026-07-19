import React, { useState } from "react";
import { Team } from "@/types/game";

interface SetupScreenProps {
  onStart: (teams: Team[]) => void;
}

const TEAM_COLORS = [
  "#3b82f6",
  "#f59e0b",
];

const TEAM_EMOJIS = ["🐺", "🐆"];
const TEAM_IMAGES = ["/teams/snow-wolf.jpg", "/teams/cheetah.jpg"];

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStart }) => {
  const [teamNames, setTeamNames] = useState<string[]>(["雪狼隊", "獵豹隊"]);

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...teamNames];
    newNames[index] = name;
    setTeamNames(newNames);
  };

  const handleStart = () => {
    const teams: Team[] = teamNames.map((name, index) => ({
      id: index + 1,
      name: name || `隊伍 ${index + 1}`,
      color: TEAM_COLORS[index],
      position: 1,
      isResting: false,
      emoji: TEAM_EMOJIS[index],
      image: TEAM_IMAGES[index],
    }));
    onStart(teams);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-8"
      style={{
        background: 'linear-gradient(135deg, #0a1929 0%, #1a2332 25%, #0d1b2a 50%, #1a2332 75%, #0a1929 100%)'
      }}
    >
      <div 
        className="rounded-3xl shadow-2xl p-12 max-w-4xl w-full border-2 border-cyan-500/50"
        style={{
          background: 'linear-gradient(135deg, #0c4a6e 0%, #075985 50%, #0c4a6e 100%)',
          boxShadow: '0 0 50px rgba(34, 211, 238, 0.5), inset 0 0 50px rgba(34, 211, 238, 0.1)'
        }}
      >
        <div className="text-center mb-12">
          <h1 
            className="text-6xl font-bold mb-4"
            style={{
              background: 'linear-gradient(90deg, #22d3ee 0%, #60a5fa 50%, #a78bfa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 20px rgba(34, 211, 238, 0.8))'
            }}
          >
            🚂 夢想探索號極速列車
          </h1>
          <p className="text-2xl text-cyan-200">準備開始你的冒險旅程！</p>
        </div>

        <div className="mb-12">
          <label className="block text-2xl font-bold mb-4 text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
            輸入各隊伍名稱
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teamNames.map((name, index) => (
              <div key={index} className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0 border-2 border-white"
                  style={{ 
                    backgroundColor: TEAM_COLORS[index],
                    boxShadow: '0 0 15px rgba(255, 255, 255, 0.5)'
                  }}
                >
                  <span
                    className="h-full w-full rounded-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${TEAM_IMAGES[index]})` }}
                  />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  className="flex-1 px-4 py-3 border-2 border-cyan-500/50 rounded-xl text-lg text-white placeholder-cyan-400/50 focus:border-cyan-400 focus:outline-none"
                  style={{
                    background: 'linear-gradient(135deg, #0a1929 0%, #0d1b2a 100%)',
                    boxShadow: '0 0 10px rgba(34, 211, 238, 0.2)'
                  }}
                  placeholder={`隊伍 ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleStart}
            className="
              px-16 py-6 rounded-2xl font-bold text-3xl border-2 border-cyan-400
              text-white hover:scale-105 transition-all duration-200
            "
            style={{
              background: 'linear-gradient(135deg, #0c4a6e 0%, #075985 100%)',
              boxShadow: '0 0 30px rgba(34, 211, 238, 0.6)'
            }}
          >
            🚂 出發！
          </button>
        </div>
      </div>
    </div>
  );
};
