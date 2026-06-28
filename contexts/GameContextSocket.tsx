"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { Team, GameState, CellType } from "@/types/game";
import { CELLS } from "@/data/cells";

interface GameContextType {
  gameState: GameState;
  startGame: (teams: Team[]) => void;
  rollDice: () => void;
  manualMove: (steps: number) => void;
  closeEvent: () => void;
  resetGame: () => void;
  isConnected: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within GameProvider");
  }
  return context;
};

const initialState: GameState = {
  teams: [],
  currentTeamIndex: 0,
  diceValue: null,
  isRolling: false,
  showEvent: false,
  eventMessage: "",
  eventType: null,
  winner: null,
  gameStarted: false,
};

const FINAL_CELL_ID = CELLS[CELLS.length - 1]?.id ?? 21;

const clampPosition = (position: number) => Math.min(Math.max(position, 1), FINAL_CELL_ID);

const formatMissionMessage = (description: string, mission?: string, hostNote?: string) =>
  [description, mission ? `站長指令：${mission}` : null, hostNote ? `主持提示：${hostNote}` : null]
    .filter(Boolean)
    .join("\n");

const formatQuizMessage = (cell: (typeof CELLS)[number]) => {
  const { effect } = cell;
  const options = Array.isArray(effect.options)
    ? effect.options.map((option, index) => `${index + 1}. ${option}`).join("\n")
    : "";

  return [
    cell.description,
    effect.question ? `題目：${effect.question}` : null,
    options,
    effect.answer ? `正確答案：${effect.answer}` : null,
    effect.penalty ? `答錯懲罰：後退 ${Math.abs(effect.penalty.value)} 格` : null,
  ]
    .filter(Boolean)
    .join("\n");
};

let socket: Socket | null = null;

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';
    socket = io(serverUrl);

    socket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    socket.on('game:state', (state: GameState) => {
      setGameState(state);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const updateGame = useCallback((updates: Partial<GameState>) => {
    if (socket) {
      socket.emit('game:update', updates);
    }
  }, []);

  const startGame = useCallback((teams: Team[]) => {
    if (socket) {
      socket.emit('game:start', {
        teams,
        currentTeamIndex: 0,
        diceValue: null,
        isRolling: false,
        showEvent: false,
        eventMessage: "",
        eventType: null,
        winner: null,
      });
    }
  }, []);

  const animateMovement = useCallback((
    currentState: GameState,
    targetPosition: number,
    onComplete: () => void
  ) => {
    const currentTeam = currentState.teams[currentState.currentTeamIndex];
    let currentPosition = currentTeam.position;
    const isForward = targetPosition > currentPosition;
    
    const moveOneStep = () => {
      if (
        (isForward && currentPosition >= targetPosition) ||
        (!isForward && currentPosition <= targetPosition)
      ) {
        const arrivedTeams = currentState.teams.map((team, idx) =>
          idx === currentState.currentTeamIndex 
            ? { ...team, position: targetPosition, justArrived: true } 
            : team
        );
        updateGame({ teams: arrivedTeams });
        
        setTimeout(() => {
          const clearedTeams = arrivedTeams.map(team => ({ ...team, justArrived: false }));
          updateGame({ teams: clearedTeams });
          onComplete();
        }, 1000);
        return;
      }
      
      currentPosition += isForward ? 1 : -1;
      const updatedTeams = currentState.teams.map((team, idx) =>
        idx === currentState.currentTeamIndex ? { ...team, position: currentPosition } : team
      );
      
      updateGame({ teams: updatedTeams });
      
      setTimeout(moveOneStep, 300);
    };
    
    moveOneStep();
  }, [updateGame]);

  const handleCellEffect = useCallback((currentState: GameState) => {
    const currentTeam = currentState.teams[currentState.currentTeamIndex];
    const cell = CELLS.find((c) => c.id === currentTeam.position);

    if (!cell) return;

    if (cell.type === "end") {
      updateGame({
        winner: currentTeam,
        showEvent: true,
        eventMessage: `🎉 恭喜 ${currentTeam.name} 抵達夢夢車站！`,
        eventType: "end" as CellType,
        isRolling: false,
      });
      return;
    }

    let updatedTeams = [...currentState.teams];
    let message = cell.description;
    let shouldShowEvent = true;

    switch (cell.type) {
      case "boost":
        message = `${cell.description}\n請再擲一次骰子！`;
        break;

      case "supply_pack":
        const supplySteps = Math.floor(Math.random() * 3) + 1;
        const supplyNewPos = clampPosition(currentTeam.position + supplySteps);
        message = `${cell.description}\n獲得 ${supplySteps} 格！前進到第 ${supplyNewPos} 格`;
        
        updateGame({
          showEvent: true,
          eventMessage: message,
          eventType: cell.type,
          isRolling: false,
        });
        
        setTimeout(() => {
          animateMovement(currentState, supplyNewPos, () => {
            updateGame({ showEvent: false, eventMessage: "", eventType: null });

            const movedTeams = currentState.teams.map((team, idx) =>
              idx === currentState.currentTeamIndex
                ? { ...team, position: supplyNewPos }
                : team
            );
            const newState = { ...currentState, teams: movedTeams };

            setTimeout(() => {
              handleCellEffect(newState);
            }, 300);
          });
        }, 2000);
        return;

      case "surprise":
        const isBackToStart = Math.random() < 0.5;
        const surprisePos = isBackToStart ? 1 : 9;
        message = isBackToStart
          ? "😱 回到起點囉！加油！"
          : "🎊 幸運傳送到第 9 格史貝瑞特車站！";
        
        updateGame({
          showEvent: true,
          eventMessage: message,
          eventType: cell.type,
          isRolling: false,
        });
        
        setTimeout(() => {
          animateMovement(currentState, surprisePos, () => {
            updateGame({ showEvent: false, eventMessage: "", eventType: null });
          });
        }, 2000);
        return;

      case "obstacle":
        if (cell.effect.type === "mission") {
          message = formatMissionMessage(cell.description, cell.effect.mission, cell.hostNote);
          break;
        }

        const backSteps = cell.effect.value || 2;
        const obstaclePos = clampPosition(currentTeam.position - backSteps);
        message = `${cell.description}\n退回到第 ${obstaclePos} 格`;
        
        updateGame({
          showEvent: true,
          eventMessage: message,
          eventType: cell.type,
          isRolling: false,
        });
        
        setTimeout(() => {
          animateMovement(currentState, obstaclePos, () => {
            updateGame({ showEvent: false, eventMessage: "", eventType: null });
          });
        }, 2000);
        return;

      case "rest":
        updatedTeams[currentState.currentTeamIndex] = {
          ...currentTeam,
          isResting: true,
        };
        break;

      case "trap":
        if (cell.effect.type === "skip_turn") {
          updatedTeams[currentState.currentTeamIndex] = {
            ...currentTeam,
            isResting: true,
          };
          message = `${cell.description}\n下一輪暫停一次。`;
          break;
        }

        if (cell.effect.type === "move") {
          const trapPos = clampPosition(currentTeam.position + (cell.effect.value || 0));
          message = `${cell.description}\n移動到第 ${trapPos} 格`;

          updateGame({
            showEvent: true,
            eventMessage: message,
            eventType: cell.type,
            isRolling: false,
          });

          setTimeout(() => {
            animateMovement(currentState, trapPos, () => {
              updateGame({ showEvent: false, eventMessage: "", eventType: null });
            });
          }, 2000);
          return;
        }

        break;

      case "goto":
        const gotoPos = cell.effect.value || 11;
        message = `${cell.description}`;
        
        updateGame({
          showEvent: true,
          eventMessage: message,
          eventType: cell.type,
          isRolling: false,
        });
        
        setTimeout(() => {
          animateMovement(currentState, gotoPos, () => {
            updateGame({ showEvent: false, eventMessage: "", eventType: null });
          });
        }, 2000);
        return;

      case "station":
        if (cell.effect.type === "mission") {
          message = formatMissionMessage(cell.description, cell.effect.mission, cell.hostNote);
        } else if (!Array.isArray(cell.effect.options) && cell.effect.options?.mission === "heart") {
          message = "💖 站長指令：做出頭上大愛心動作！📸";
        } else if (!Array.isArray(cell.effect.options) && cell.effect.options?.mission === "stomp") {
          message = "👟 站長指令：全隊一起腳踏地板！";
        }
        break;

      case "quiz":
        message = formatQuizMessage(cell);
        break;

      default:
        shouldShowEvent = false;
    }

    if (!shouldShowEvent) {
      let nextTeamIndex = (currentState.currentTeamIndex + 1) % currentState.teams.length;
      const finalTeams = updatedTeams.map((team, idx) =>
        idx === currentState.currentTeamIndex && team.isResting
          ? { ...team, isResting: false }
          : team
      );

      while (finalTeams[nextTeamIndex]?.isResting && nextTeamIndex !== currentState.currentTeamIndex) {
        finalTeams[nextTeamIndex] = { ...finalTeams[nextTeamIndex], isResting: false };
        nextTeamIndex = (nextTeamIndex + 1) % currentState.teams.length;
      }

      updateGame({
        teams: finalTeams,
        currentTeamIndex: nextTeamIndex,
        showEvent: false,
        eventMessage: "",
        eventType: null,
        diceValue: null,
        isRolling: false,
      });
      return;
    }

    updateGame({
      teams: updatedTeams,
      showEvent: shouldShowEvent,
      eventMessage: message,
      eventType: cell.type,
      isRolling: false,
    });
  }, [updateGame, animateMovement]);

  const moveCurrentTeam = useCallback((steps: number, currentState: GameState) => {
    const currentTeam = currentState.teams[currentState.currentTeamIndex];
    
    if (currentTeam.isResting) {
      updateGame({
        isRolling: false,
        showEvent: true,
        eventMessage: `${currentTeam.name} 正在休息中，跳過這一輪！`,
        eventType: "rest" as CellType,
      });
      return;
    }

    const targetPosition = clampPosition(currentTeam.position + steps);
    let currentPosition = currentTeam.position;
    
    const moveOneStep = () => {
      if (currentPosition >= targetPosition) {
        const arrivedTeams = currentState.teams.map((team, idx) =>
          idx === currentState.currentTeamIndex 
            ? { ...team, position: targetPosition, justArrived: true } 
            : team
        );
        updateGame({ teams: arrivedTeams });
        
        setTimeout(() => {
          const clearedTeams = arrivedTeams.map(team => ({ ...team, justArrived: false }));
          const newState = { ...currentState, teams: clearedTeams };
          updateGame({ teams: clearedTeams });
          
          setTimeout(() => {
            handleCellEffect(newState);
          }, 300);
        }, 1000);
        return;
      }
      
      currentPosition++;
      const updatedTeams = currentState.teams.map((team, idx) =>
        idx === currentState.currentTeamIndex ? { ...team, position: currentPosition } : team
      );
      
      updateGame({ teams: updatedTeams });
      
      setTimeout(moveOneStep, 400);
    };
    
    moveOneStep();
  }, [updateGame, handleCellEffect]);

  const rollDice = useCallback(() => {
    if (gameState.isRolling || gameState.winner) return;

    updateGame({ isRolling: true, diceValue: null });

    const currentGameState = gameState;

    setTimeout(() => {
      const value = Math.floor(Math.random() * 6) + 1;
      updateGame({ diceValue: value });

      setTimeout(() => {
        moveCurrentTeam(value, currentGameState);
      }, 500);
    }, 1000);
  }, [gameState, updateGame, moveCurrentTeam]);

  const manualMove = useCallback((steps: number) => {
    if (gameState.isRolling || gameState.winner || gameState.showEvent) return;
    if (steps < 1 || steps > 6) return;

    updateGame({ isRolling: true, diceValue: steps });

    const currentGameState = gameState;

    setTimeout(() => {
      moveCurrentTeam(steps, currentGameState);
    }, 500);
  }, [gameState, updateGame, moveCurrentTeam]);

  const closeEvent = useCallback(() => {
    const shouldRollAgain = gameState.eventType === "boost";
    
    if (shouldRollAgain) {
      updateGame({
        showEvent: false,
        eventMessage: "",
        eventType: null,
      });
      return;
    }

    let nextTeamIndex = (gameState.currentTeamIndex + 1) % gameState.teams.length;
    const shouldClearCurrentRest =
      gameState.eventType === "rest" && gameState.eventMessage.includes("正在休息中");
    const updatedTeams = gameState.teams.map((team, idx) =>
      shouldClearCurrentRest && idx === gameState.currentTeamIndex && team.isResting
        ? { ...team, isResting: false }
        : team
    );

    while (updatedTeams[nextTeamIndex]?.isResting && nextTeamIndex !== gameState.currentTeamIndex) {
      updatedTeams[nextTeamIndex] = { ...updatedTeams[nextTeamIndex], isResting: false };
      nextTeamIndex = (nextTeamIndex + 1) % gameState.teams.length;
    }

    updateGame({
      teams: updatedTeams,
      currentTeamIndex: nextTeamIndex,
      showEvent: false,
      eventMessage: "",
      eventType: null,
      diceValue: null,
    });
  }, [gameState, updateGame]);

  const resetGame = useCallback(() => {
    if (socket) {
      socket.emit('game:reset');
    }
  }, []);

  return (
    <GameContext.Provider
      value={{
        gameState,
        startGame,
        rollDice,
        manualMove,
        closeEvent,
        resetGame,
        isConnected,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
