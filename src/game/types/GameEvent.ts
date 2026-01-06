export type GameEventType = "info" | "good" | "bad";

export type GameEvent = {
  id: string;
  tMs: number;
  type: GameEventType;
  text: string;
};
