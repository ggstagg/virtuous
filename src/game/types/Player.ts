import type { EntityBase } from "./EntityBase";

export interface Player extends EntityBase {
  virtuePoints: number;
  vicePoints: number;

  actionCooldownMs: number;
  actionIntervalMs: number;
}

export type PlayerActions = "attack" | "heal" | null;
