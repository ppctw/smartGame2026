import { useState, useCallback } from "react";
import { Team, GameState, CellType } from "@/types/game";
import { CELLS } from "@/data/cells";

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    teams: [],
    currentTeamIndex: 0,
    diceValue: null,
    isRolling: false,
    showEvent: false,
    eventMessage: "",
    eventType: null,
    winner: null,
    gameStarted: false,
  });

  const startGame = useCallback((teams: Team[]) => {
    setGameState({
      teams,
      currentTeamIndex: 0,
      diceValue: null,
      isRolling: false,
      showEvent: false,
      eventMessage: "",
      eventType: null,
      winner: null,
      gameStarted: true,
    });
  }, []);

  const rollDice = useCallback(() => {
    if (gameState.isRolling || gameState.winner) return;

    setGameState((prev) => ({ ...prev, isRolling: true, diceValue: null }));

    setTimeout(() => {
      const value = Math.floor(Math.random() * 6) + 1;
      setGameState((prev) => ({ ...prev, diceValue: value }));

      setTimeout(() => {
        moveCurrentTeam(value);
      }, 500);
    }, 1000);
  }, [gameState.isRolling, gameState.winner]);

  const moveCurrentTeam = useCallback((steps: number) => {
    setGameState((prev) => {
      const currentTeam = prev.teams[prev.currentTeamIndex];
      if (currentTeam.isResting) {
        return {
          ...prev,
          isRolling: false,
          showEvent: true,
          eventMessage: `${currentTeam.name} 正在休息中，跳過這一輪！`,
          eventType: "rest" as CellType,
        };
      }

      const newPosition = Math.min(currentTeam.position + steps, 16);
      const updatedTeams = prev.teams.map((team, idx) =>
        idx === prev.currentTeamIndex ? { ...team, position: newPosition } : team
      );

      return {
        ...prev,
        teams: updatedTeams,
        isRolling: false,
      };
    });

    setTimeout(() => {
      handleCellEffect();
    }, 500);
  }, []);

  const handleCellEffect = useCallback(() => {
    setGameState((prev) => {
      const currentTeam = prev.teams[prev.currentTeamIndex];
      const cell = CELLS.find((c) => c.id === currentTeam.position);

      if (!cell) return prev;

      if (cell.type === "end") {
        return {
          ...prev,
          winner: currentTeam,
          showEvent: true,
          eventMessage: `🎉 恭喜 ${currentTeam.name} 抵達夢夢車站！`,
          eventType: "end" as CellType,
        };
      }

      let updatedTeams = [...prev.teams];
      let message = cell.description;
      let shouldShowEvent = true;

      switch (cell.type) {
        case "boost":
          message = `${cell.description}\n請再擲一次骰子！`;
          break;

        case "supply_pack":
          const supplySteps = Math.floor(Math.random() * 3) + 1;
          const newPos = Math.min(currentTeam.position + supplySteps, 16);
          updatedTeams[prev.currentTeamIndex] = {
            ...currentTeam,
            position: newPos,
          };
          message = `${cell.description}\n獲得 ${supplySteps} 格！前進到第 ${newPos} 格`;
          break;

        case "surprise":
          const isBackToStart = Math.random() < 0.5;
          const surprisePos = isBackToStart ? 1 : 9;
          updatedTeams[prev.currentTeamIndex] = {
            ...currentTeam,
            position: surprisePos,
          };
          message = isBackToStart
            ? "😱 回到起點囉！加油！"
            : "🎊 幸運傳送到第 9 格史貝瑞特車站！";
          break;

        case "obstacle":
          const backSteps = cell.effect.value || 2;
          const obstaclePos = Math.max(currentTeam.position - backSteps, 1);
          updatedTeams[prev.currentTeamIndex] = {
            ...currentTeam,
            position: obstaclePos,
          };
          message = `${cell.description}\n退回到第 ${obstaclePos} 格`;
          break;

        case "rest":
          updatedTeams[prev.currentTeamIndex] = {
            ...currentTeam,
            isResting: true,
          };
          break;

        case "goto":
          const gotoPos = cell.effect.value || 11;
          updatedTeams[prev.currentTeamIndex] = {
            ...currentTeam,
            position: gotoPos,
          };
          message = `${cell.description}`;
          break;

        case "station":
          if (cell.effect.options?.mission === "heart") {
            message = "💖 站長指令：做出頭上大愛心動作！📸";
          } else if (cell.effect.options?.mission === "stomp") {
            message = "👟 站長指令：全隊一起腳踏地板！";
          }
          break;

        default:
          shouldShowEvent = false;
      }

      return {
        ...prev,
        teams: updatedTeams,
        showEvent: shouldShowEvent,
        eventMessage: message,
        eventType: cell.type,
      };
    });
  }, []);

  const closeEvent = useCallback(() => {
    setGameState((prev) => {
      const shouldRollAgain = prev.eventType === "boost";
      
      if (shouldRollAgain) {
        return {
          ...prev,
          showEvent: false,
          eventMessage: "",
          eventType: null,
        };
      }

      let nextTeamIndex = (prev.currentTeamIndex + 1) % prev.teams.length;
      const updatedTeams = prev.teams.map((team, idx) =>
        idx === prev.currentTeamIndex && team.isResting
          ? { ...team, isResting: false }
          : team
      );

      while (updatedTeams[nextTeamIndex]?.isResting && nextTeamIndex !== prev.currentTeamIndex) {
        updatedTeams[nextTeamIndex] = { ...updatedTeams[nextTeamIndex], isResting: false };
        nextTeamIndex = (nextTeamIndex + 1) % prev.teams.length;
      }

      return {
        ...prev,
        teams: updatedTeams,
        currentTeamIndex: nextTeamIndex,
        showEvent: false,
        eventMessage: "",
        eventType: null,
        diceValue: null,
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      teams: [],
      currentTeamIndex: 0,
      diceValue: null,
      isRolling: false,
      showEvent: false,
      eventMessage: "",
      eventType: null,
      winner: null,
      gameStarted: false,
    });
  }, []);

  return {
    gameState,
    startGame,
    rollDice,
    closeEvent,
    resetGame,
  };
};
