import type { Direction } from "./Direction";
import type { EntityBase } from "./EntityBase";

export interface Enemy extends EntityBase {
  behaviorType: "chaser" | "wanderer";

  thinkCooldownMs: number;
  thinkIntervalMs: number;

  targetEntityId: string | null;
  nextDirection: Direction | null;
}
