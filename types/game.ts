export type CellType =
  | "start"
  | "end"
  | "boost"
  | "supply_pack"
  | "station"
  | "surprise"
  | "obstacle"
  | "rest"
  | "repair"
  | "goto";

export interface CellEffect {
  type: CellType;
  value?: number;
  options?: any;
}

export interface Cell {
  id: number;
  name: string;
  type: CellType;
  description: string;
  effect: CellEffect;
  icon: string;
  color: string;
}

export interface Team {
  id: number;
  name: string;
  color: string;
  position: number;
  isResting: boolean;
  emoji: string;
  justArrived?: boolean;
}

export interface GameState {
  teams: Team[];
  currentTeamIndex: number;
  diceValue: number | null;
  isRolling: boolean;
  showEvent: boolean;
  eventMessage: string;
  eventType: CellType | null;
  winner: Team | null;
  gameStarted: boolean;
}
