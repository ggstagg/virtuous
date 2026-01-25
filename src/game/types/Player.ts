import type { EntityBase } from "./EntityBase";

export interface Player extends EntityBase {
  virtuePoints: number;
  vicePoints: number;

  attackCooldownMs: number;
  attackIntervalMs: number;
}
