import React from "react";
import { Cell, Team } from "@/types/game";
import { CELLS } from "@/data/cells";

interface GameBoardProps {
  teams: Team[];
  currentTeamIndex: number;
}

export const GameBoard: React.FC<GameBoardProps> = ({ teams, currentTeamIndex }) => {
  const getTeamsAtCell = (cellId: number) => {
    return teams.filter((team) => team.position === cellId);
  };

  const renderCell = (cell: Cell) => {
    const teamsHere = getTeamsAtCell(cell.id);
    const isCurrentTeamHere = teamsHere.some((t) => t.id === teams[currentTeamIndex]?.id);

    return (
      <div
        key={cell.id}
        className={`
          relative bg-gradient-to-br from-blue-950 to-blue-900 rounded-xl
          border-2 transition-all duration-300 overflow-hidden
          ${isCurrentTeamHere 
            ? "border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.6)] scale-105" 
            : "border-cyan-600/50 shadow-[0_0_10px_rgba(34,211,238,0.3)]"
          }
        `}
        style={{
          boxShadow: isCurrentTeamHere 
            ? '0 0 20px rgba(34, 211, 238, 0.6), inset 0 0 20px rgba(34, 211, 238, 0.1)' 
            : '0 0 10px rgba(34, 211, 238, 0.3), inset 0 0 10px rgba(34, 211, 238, 0.05)'
        }}
      >
        <div className="text-center relative z-10 flex flex-col items-center justify-center h-full p-1 min-h-0 overflow-hidden">
          <div className="drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] leading-none" style={{ fontSize: 'clamp(1.8rem, 3.75vw, 4.2rem)' }}>
            {cell.icon}
          </div>
          <div className="font-bold text-cyan-300" style={{ fontSize: 'clamp(0.825rem, 1.5vw, 1.65rem)' }}>
            {cell.id}
          </div>
          <div className="font-semibold text-white drop-shadow-lg w-full text-center truncate" style={{ fontSize: 'clamp(0.75rem, 1.35vw, 1.5rem)' }}>
            {cell.name}
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg pointer-events-none" />

        {teamsHere.length > 0 && (
          <div className="absolute inset-0 flex items-center justify-between px-1 z-20 pointer-events-none">
            <div className="flex flex-col gap-1">
              {teamsHere.slice(0, Math.ceil(teamsHere.length / 2)).map((team) => (
                <div
                  key={team.id}
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-4xl shadow-lg border-2 border-white ${team.justArrived ? 'piece-arrived' : ''}`}
                  style={{ 
                    backgroundColor: team.color,
                    boxShadow: '0 0 20px rgba(255, 255, 255, 0.9)'
                  }}
                  title={team.name}
                >
                  {team.emoji}
                </div>
              ))}
            </div>
            {teamsHere.length > 1 && (
              <div className="flex flex-col gap-1">
                {teamsHere.slice(Math.ceil(teamsHere.length / 2)).map((team) => (
                  <div
                    key={team.id}
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-4xl shadow-lg border-2 border-white ${team.justArrived ? 'piece-arrived' : ''}`}
                    style={{ 
                      backgroundColor: team.color,
                      boxShadow: '0 0 20px rgba(255, 255, 255, 0.9)'
                    }}
                    title={team.name}
                  >
                    {team.emoji}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const topRow = CELLS.slice(0, 5);
  const rightCol = CELLS.slice(5, 8);
  const bottomRow = CELLS.slice(8, 13).reverse();
  const leftCol = CELLS.slice(13, 16).reverse();

  const getCellByPosition = (row: number, col: number): Cell | null => {
    if (row === 0) return topRow[col] || null;
    if (row === 4) return bottomRow[col] || null;
    if (col === 0 && row >= 1 && row <= 3) return leftCol[row - 1] || null;
    if (col === 4 && row >= 1 && row <= 3) return rightCol[row - 1] || null;
    return null;
  };

  const gridItems: React.ReactNode[] = [];

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      const isPerimeter = row === 0 || row === 4 || col === 0 || col === 4;
      const isCenterAnchor = row === 1 && col === 1;

      if (isCenterAnchor) {
        gridItems.push(
          <div
            key="center-banner"
            className="col-span-3 row-span-3 flex items-center justify-center rounded-3xl border-2 border-cyan-500/50 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(59, 130, 246, 0.15) 100%)',
              boxShadow: '0 0 40px rgba(34, 211, 238, 0.3), inset 0 0 40px rgba(34, 211, 238, 0.1)'
            }}
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDM0LCAyMTEsIDIzOCwgMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
            <div className="relative z-10 text-center">
              <div className="text-7xl mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">🚂</div>
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 mb-2 drop-shadow-lg">
                夢想探索號
              </h2>
              <div className="text-2xl font-bold text-cyan-400 mb-1">2026</div>
              <p className="text-lg text-cyan-200">前往夢夢車站</p>
            </div>
          </div>
        );
        continue;
      }

      if (!isPerimeter) {
        continue;
      }

      const cell = getCellByPosition(row, col);
      if (cell) {
        gridItems.push(renderCell(cell));
      }
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className="relative w-full max-h-full aspect-video p-2 rounded-3xl"
        style={{
          background: 'linear-gradient(135deg, #0a1929 0%, #1a2332 50%, #0d1b2a 100%)',
          boxShadow: 'inset 0 0 50px rgba(34, 211, 238, 0.1), 0 0 50px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div className="h-full grid grid-cols-5 grid-rows-5 gap-2 relative">
          {gridItems}
        </div>
      </div>
    </div>
  );
};
