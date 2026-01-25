import { DirectionDelta, DIRECTIONS } from "../../types/Direction";
import type {
  Path,
  Pathfinder,
  PathfindingContext,
  PathNode,
} from "../../types/Pathfinding";
import type { WorldState } from "../../types/WorldState";

function inBounds(world: WorldState, r: number, c: number) {
  return (
    r >= 0 &&
    c >= 0 &&
    r < world.grid.length &&
    c < (world.grid[0]?.length ?? 0)
  );
}

function explore(
  world: WorldState,
  startNode: PathNode,
  targetNode: PathNode,
  maxDepth: number,
  maxNodes: number,
  state: {
    visited: boolean[][];
    visitedCount: number;
    depth: number;
    path: Path;
  }
): boolean {
  if (maxNodes >= 0 && state.visitedCount >= maxNodes) return false;
  if (maxDepth >= 0 && state.depth > maxDepth) return false;

  if (state.visited[startNode.r][startNode.c]) return false;
  state.visited[startNode.r][startNode.c] = true;
  state.visitedCount++;

  if (startNode.r === targetNode.r && startNode.c === targetNode.c) {
    state.path.push(startNode);
    return true;
  }

  for (const direction of Object.values(DIRECTIONS)) {
    const nextR = startNode.r + DirectionDelta[direction].dr;
    const nextC = startNode.c + DirectionDelta[direction].dc;

    if (!inBounds(world, nextR, nextC)) continue;
    if (state.visited[nextR][nextC]) continue;

    const tile = world.grid[nextR][nextC];
    const isGoal = nextR === targetNode.r && nextC === targetNode.c;

    if (!isGoal) if (!tile.isWalkable || tile.entityId) continue;

    state.depth++;

    const found = explore(
      world,
      { r: nextR, c: nextC },
      targetNode,
      maxDepth,
      maxNodes,
      state
    );

    state.depth--;

    if (found) {
      state.path.push(startNode);
      return true;
    }
  }

  state.visited[startNode.r][startNode.c] = false;
  return false;
}

export const dfsPathfinder: Pathfinder = (
  world: WorldState,
  ctx: PathfindingContext
): Path | null => {
  const rows = world.grid.length;
  const cols = world.grid[0]?.length ?? 0;
  if (rows === 0 || cols === 0) return null;

  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));

  const path: Path = [];
  const startNode: PathNode = { r: ctx.startR, c: ctx.startC };
  const targetNode: PathNode = { r: ctx.goalR, c: ctx.goalC };
  const maxNodes: number = ctx.maxNodes ?? -1;
  const maxDepth: number = ctx.maxDepth ?? -1;

  const found = explore(world, startNode, targetNode, maxDepth, maxNodes, {
    visited,
    visitedCount: 0,
    depth: 0,
    path,
  });

  if (!found) {
    return null;
  }

  path.reverse();

  return found ? path : null;
};
