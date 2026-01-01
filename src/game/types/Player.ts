import type { EntityBase } from "./EntityBase";

export interface Player extends EntityBase {
  startR: number;
  startC: number;

  moveCooldownMs: number;
  moveDurationMs: number;
  moveProgressMs: number;

  virtuePoints: number;
  vicePoints: number;
}
