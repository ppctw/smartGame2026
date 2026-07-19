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
  | "goto"
  | "trap"
  | "quiz";

export type CellEffectType =
  | CellType
  | "extra_roll"
  | "skip_turn"
  | "mission"
  | "move"
  | "quiz";

export interface MoveEffect {
  type: "move";
  value: number;
}

export interface CellEffect {
  type: CellEffectType;
  value?: number;
  mission?: string;
  question?: string;
  options?: string[] | Record<string, unknown>;
  answer?: number;
  penalty?: MoveEffect;
}

export interface Cell {
  id: number;
  name: string;
  type: CellType;
  description: string;
  effect: CellEffect;
  hostNote?: string;
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
  image?: string;
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
