import type { Direction } from "./Direction";
import type { EntityBase } from "./EntityBase";
import type { Pathfinder } from "./Pathfinding";

export interface Enemy extends EntityBase {
  behaviorType: "chaser" | "wanderer";

  thinkCooldownMs: number;
  thinkIntervalMs: number;

  targetEntityId: string | null;
  nextDirection: Direction | null;

  pathfinder: Pathfinder;
  currentPath: { r: number; c: number }[] | null;
  pathIndex: number;
  pathGoalR: number | null;
  pathGoalC: number | null;
}
