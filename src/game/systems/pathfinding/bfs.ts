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

function inVision(ctx: PathfindingContext, r: number, c: number) {
  const vr = ctx.visionRadius as number | undefined;
  const vcr = ctx.visionCenterR as number | undefined;
  const vcc = ctx.visionCenterC as number | undefined;
  if (vr === undefined || vcr === undefined || vcc === undefined) return true;

  const dr = Math.abs(r - vcr);
  const dc = Math.abs(c - vcc);
  return dr + dc <= vr;
}

function key(r: number, c: number) {
  return `${r},${c}`;
}

export const bfsPathfinder: Pathfinder = (
  world: WorldState,
  ctx: PathfindingContext
): Path | null => {
  const rows = world.grid.length;
  const cols = world.grid[0]?.length ?? 0;
  if (rows === 0 || cols === 0) return null;

  const startNode: PathNode = { r: ctx.startR, c: ctx.startC };
  const targetNode: PathNode = { r: ctx.goalR, c: ctx.goalC };

  if (!inBounds(world, startNode.r, startNode.c)) return null;
  if (!inBounds(world, targetNode.r, targetNode.c)) return null;

  const targetTile = world.grid[targetNode.r][targetNode.c];
  if (!targetTile.isWalkable) return null;

  const maxNodes = ctx.maxNodes ?? -1;

  const bfsQueue: PathNode[] = [];
  let qi = 0;

  const parentMap = new Map<string, string | null>();
  parentMap.set(key(startNode.r, startNode.c), null);
  bfsQueue.push(startNode);

  let visitedCount = 0;

  while (qi < bfsQueue.length) {
    const currentNode = bfsQueue[qi++];
    visitedCount++;
    if (maxNodes >= 0 && visitedCount > maxNodes) return null;

    if (currentNode.r === targetNode.r && currentNode.c === targetNode.c) {
      const out: Path = [];
      let currentKey: string | null = key(currentNode.r, currentNode.c);
      while (currentKey) {
        const [currentR, currentC] = currentKey.split(",");
        out.push({ r: Number(currentR), c: Number(currentC) });
        currentKey = parentMap.get(currentKey) ?? null;
      }
      out.reverse();
      return out;
    }

    for (const direction of Object.values(DIRECTIONS)) {
      const { dr, dc } = DirectionDelta[direction];
      const nextR = currentNode.r + dr;
      const nextC = currentNode.c + dc;

      if (!inBounds(world, nextR, nextC)) continue;
      if (!inVision(ctx, nextR, nextC)) continue;

      const nextKey = key(nextR, nextC);
      if (parentMap.has(nextKey)) continue; // visited

      const tile = world.grid[nextR][nextC];
      const isGoal = nextR === targetNode.r && nextC === targetNode.c;

      if (!tile.isWalkable) continue;
      if (!isGoal && tile.entityId !== null) continue; 

      parentMap.set(nextKey, key(currentNode.r, currentNode.c));
      bfsQueue.push({ r: nextR, c: nextC });
    }
  }

  return null;
};
