import type { Enemy } from "./Enemy";
import type { GameEvent } from "./GameEvent";
import type { Grid } from "./Grid";
import type { Neutral } from "./Neutral";
import type { Player } from "./Player";

export interface WorldState {
  grid: Grid;

  player: Player;

  enemies: Record<string, Enemy>;
  neutrals: Record<string, Neutral>;

  tick: number;
  seed: number;

  eventLog: GameEvent[];

  gameOver: boolean;

  renderMode: "debug" | "game";
}
