import React from "react";
import { Cell, Team } from "@/types/game";
import { CELLS } from "@/data/cells";

interface GameBoardProps {
  teams: Team[];
  currentTeamIndex: number;
}

type GridPlacement = React.CSSProperties & {
  gridColumn: number | string;
  gridRow: number | string;
};

const splitCellName = (name: string) => name.replace(/\\n/g, "\n").split(/\r?\n/).filter(Boolean);

const createBoardLayout = (cells: Cell[]) => {
  const regularCellCount = Math.max(cells.length - 2, 0);
  const candidates = Array.from({ length: 5 }, (_, index) => index + 7).flatMap((columns) =>
    Array.from({ length: 4 }, (_, index) => index + 5).map((rows) => {
      const capacity = (columns - 1) + (rows - 2) + columns + Math.max(rows - 5, 0);
      const emptySlots = capacity - regularCellCount;
      const cellAspect = (16 * rows) / (9 * columns);

      return { columns, rows, capacity, emptySlots, cellAspect };
    })
  );
  const bestLayout = candidates
    .filter((candidate) => candidate.emptySlots >= 0)
    .sort((a, b) => {
      if (a.emptySlots !== b.emptySlots) {
        return a.emptySlots - b.emptySlots;
      }

      return Math.abs(a.cellAspect - 1.25) - Math.abs(b.cellAspect - 1.25);
    })[0];
  const columnCount = bestLayout?.columns ?? 8;
  const rowCount = bestLayout?.rows ?? 6;
  const occupied = new Set<string>();
  const placements = new Map<number, GridPlacement>();

  const occupy = (cellId: number, column: number, row: number, rowSpan = 1) => {
    placements.set(cellId, {
      gridColumn: column,
      gridRow: rowSpan === 1 ? row : `${row} / span ${rowSpan}`,
    });

    for (let offset = 0; offset < rowSpan; offset += 1) {
      occupied.add(`${column}:${row + offset}`);
    }
  };

  const startCell = cells[0];
  const endCell = cells[cells.length - 1];

  if (startCell) {
    occupy(startCell.id, 1, 1, 2);
  }

  if (endCell) {
    occupy(endCell.id, 1, 3, 2);
  }

  const path: Array<{ column: number; row: number }> = [];

  for (let column = 2; column <= columnCount; column += 1) {
    path.push({ column, row: 1 });
  }

  for (let row = 2; row < rowCount; row += 1) {
    path.push({ column: columnCount, row });
  }

  for (let column = columnCount; column >= 1; column -= 1) {
    path.push({ column, row: rowCount });
  }

  for (let row = rowCount - 1; row >= 1; row -= 1) {
    path.push({ column: 1, row });
  }

  const regularCells = cells.slice(1, -1);
  let pathIndex = 0;

  regularCells.forEach((cell) => {
    while (pathIndex < path.length) {
      const point = path[pathIndex];
      pathIndex += 1;

      if (!occupied.has(`${point.column}:${point.row}`)) {
        occupy(cell.id, point.column, point.row);
        return;
      }
    }
  });

  return {
    columnCount,
    rowCount,
    getPlacement: (cellId: number) => placements.get(cellId) || { gridColumn: 1, gridRow: 1 },
  };
};

export const GameBoard: React.FC<GameBoardProps> = ({ teams, currentTeamIndex }) => {
  const boardLayout = createBoardLayout(CELLS);

  const getTeamsAtCell = (cellId: number) => {
    return teams.filter((team) => team.position === cellId);
  };

  const renderCell = (cell: Cell) => {
    const teamsHere = getTeamsAtCell(cell.id);
    const isCurrentTeamHere = teamsHere.some((t) => t.id === teams[currentTeamIndex]?.id);
    const isSpecialEndpoint = cell.id === 1 || cell.type === "end";
    const cellNameLines = splitCellName(cell.name);

    return (
      <div
        key={cell.id}
        data-board-cell={cell.id}
        className={`
          relative bg-gradient-to-br from-blue-950 to-blue-900 rounded-xl
          border-2 transition-all duration-300 overflow-hidden
          ${isCurrentTeamHere 
            ? "border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.6)]" 
            : "border-cyan-600/50 shadow-[0_0_10px_rgba(34,211,238,0.3)]"
          }
        `}
        style={{
          ...boardLayout.getPlacement(cell.id),
          containerType: "size",
          boxShadow: isCurrentTeamHere 
            ? '0 0 20px rgba(34, 211, 238, 0.6), inset 0 0 20px rgba(34, 211, 238, 0.1)' 
            : '0 0 10px rgba(34, 211, 238, 0.3), inset 0 0 10px rgba(34, 211, 238, 0.05)'
        }}
      >
        <div
          className="absolute right-1.5 top-1.5 z-30 rounded-md border border-cyan-200/70 bg-slate-950/75 px-1.5 py-0.5 font-bold leading-none text-cyan-200 shadow-[0_0_10px_rgba(34,211,238,0.35)]"
          style={{ fontSize: isSpecialEndpoint ? 'clamp(0.8rem, 8cqw, 1.15rem)' : 'clamp(0.65rem, 7cqw, 0.95rem)' }}
        >
          {cell.id}
        </div>
        <div
          className={`text-center relative z-10 flex flex-col items-center justify-center h-full p-2 min-h-0 overflow-hidden ${
            teamsHere.length > 0 ? "pb-9" : ""
          }`}
        >
          <div
            className="drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] leading-none"
            style={{ fontSize: isSpecialEndpoint ? 'clamp(2rem, 34cqw, 4.25rem)' : 'clamp(1.45rem, 25cqw, 3.2rem)' }}
          >
            {cell.icon}
          </div>
          <div
            className="mt-1 font-semibold text-white drop-shadow-lg w-full text-center leading-tight px-1"
            style={{ fontSize: isSpecialEndpoint ? 'clamp(0.8rem, 10cqw, 1.35rem)' : 'clamp(0.65rem, 8.5cqw, 1.15rem)' }}
            title={cell.name}
          >
            {cellNameLines.map((line, index) => (
              <span key={`${cell.id}-${index}`} className="block truncate">
                {line}
              </span>
            ))}
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg pointer-events-none" />

        {teamsHere.length > 0 && (
          <div className="absolute bottom-1.5 left-1.5 right-1.5 z-20 flex items-center justify-center gap-1 pointer-events-none">
            {teamsHere.map((team) => (
              <div
                key={team.id}
                className={`h-8 w-8 rounded-full flex items-center justify-center text-xl shadow-lg border-2 border-white ${team.justArrived ? 'piece-arrived' : ''}`}
                style={{
                  backgroundColor: team.color,
                  boxShadow: '0 0 16px rgba(255, 255, 255, 0.9)'
                }}
                title={team.name}
              >
                {team.emoji}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className="relative w-full max-h-full aspect-video rounded-3xl"
        style={{
          padding: "clamp(0.6rem, 0.75vw, 1rem)",
          background: 'linear-gradient(135deg, #0a1929 0%, #1a2332 50%, #0d1b2a 100%)',
          boxShadow: 'inset 0 0 50px rgba(34, 211, 238, 0.1), 0 0 50px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div
          className="h-full grid relative"
          style={{
            gridTemplateColumns: `repeat(${boardLayout.columnCount}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${boardLayout.rowCount}, minmax(0, 1fr))`,
            gap: "clamp(0.5rem, 0.65vw, 0.9rem)",
          }}
        >
          {CELLS.map(renderCell)}
          <div
            className="flex items-center justify-center rounded-3xl border-2 border-cyan-500/50 relative overflow-hidden"
            style={{
              gridColumn: `2 / span ${boardLayout.columnCount - 2}`,
              gridRow: `2 / span ${boardLayout.rowCount - 2}`,
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
        </div>
      </div>
    </div>
  );
};
