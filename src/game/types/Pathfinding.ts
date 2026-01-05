import type { WorldState } from "./WorldState";

export type PathNode = {
  r: number;
  c: number;
};

export type Path = PathNode[];

export interface PathfindingContext {
  startR: number;
  startC: number;
  goalR: number;
  goalC: number;
  visionCenterR: number;
  visionCenterC: number;
  visionRadius: number;
  maxNodes?: number; // max nodes that can be searched in a single query
  maxDepth?: number; // max size of a path
}

export type Pathfinder = (
  world: WorldState,
  ctx: PathfindingContext
) => Path | null;
