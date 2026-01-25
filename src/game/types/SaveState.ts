import type { Enemy } from "./Enemy";
import type { Neutral } from "./Neutral";
import type { Player } from "./Player";
import type { Tile } from "./Tile";

export type SaveState = {
  savedAt: number;
  seed: number;
  tick: number;
  gameOver: boolean;

  player: Player;

  enemies: Record<
    string,
    Omit<Enemy, "pathfinder" | "currentPath" | "pathIndex" | "nextDirection">
  >;

  neutrals: Record<string, Neutral>;

  grid: Array<Array<Omit<Tile, "entityId">>>;
  renderMode: "game" | "debug";
};
