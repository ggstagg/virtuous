import type { WorldState } from "../types/WorldState";
import type { Enemy } from "../types/Enemy";
import { DIRECTIONS, type Direction } from "../types/Direction";
import type { PathNode } from "../types/Pathfinding";
import { manhattanDistance } from "./pathfinding/manhattan";

function directionFromTo(
  r0: number,
  c0: number,
  r1: number,
  c1: number
): Direction | null {
  console.log(`r0: ${r0}, c0: ${c0}, r1: ${r1}, c1: ${c1}`);
  const dr = r1 - r0;
  const dc = c1 - c0;

  if (dr === -1 && dc === 0) return DIRECTIONS.North;
  if (dr === 1 && dc === 0) return DIRECTIONS.South;
  if (dr === 0 && dc === 1) return DIRECTIONS.East;
  if (dr === 0 && dc === -1) return DIRECTIONS.West;

  return null;
}

function clearPlan(enemy: Enemy) {
  enemy.currentPath = null;
  enemy.pathIndex = 0;
  enemy.nextDirection = null;
  enemy.pathGoalR = null;
  enemy.pathGoalC = null;
}

export function enemyAISystem(world: WorldState, dtMs: number) {
  const player = world.player;

  for (const enemy of Object.values(world.enemies)) {
    enemy.thinkCooldownMs -= dtMs;
    if (enemy.thinkCooldownMs > 0) continue;
    if (enemy.targetR !== null && enemy.targetC !== null) continue;
    enemy.thinkCooldownMs = enemy.thinkIntervalMs;

    const dist = manhattanDistance(enemy.r, enemy.c, player.r, player.c);
    if (dist === 1) {
      enemy.nextDirection = directionFromTo(
        enemy.r,
        enemy.c,
        player.r,
        player.c
      );
      enemy.currentPath = null;
      enemy.pathIndex = 0;
      continue;
    }
    if (dist > enemy.visionRadius) {
      clearPlan(enemy);
      continue;
    }

    const goalChanged =
      enemy.pathGoalR !== player.r || enemy.pathGoalC !== player.c;
    if (goalChanged) {
      clearPlan(enemy);
    }

    // if no plan or plan exhausted, compute a new path
    const pathDone =
      enemy.currentPath === null || enemy.pathIndex >= enemy.currentPath.length;

    if (pathDone) {
      const newPath = enemy.pathfinder(world, {
        startR: enemy.r,
        startC: enemy.c,
        goalR: player.r,
        goalC: player.c,
        visionCenterR: enemy.r,
        visionCenterC: enemy.c,
        visionRadius: enemy.visionRadius,
        maxDepth: enemy.visionRadius,
        maxNodes: 500,
      });

      if (!newPath || newPath.length < 2) {
        clearPlan(enemy);
        continue;
      }

      enemy.currentPath = newPath;
      enemy.pathIndex = 1; // 0 is current tile, 1 is next step
      enemy.pathGoalR = player.r;
      enemy.pathGoalC = player.c;
    }

    const next: PathNode | undefined = enemy.currentPath?.[enemy.pathIndex];
    if (!next) {
      clearPlan(enemy);
      continue;
    }
    console.log("next: ", next);

    const dir = directionFromTo(enemy.r, enemy.c, next.r, next.c);
    console.log("next direction: ", dir);
    if (!dir) {
      // path isn't adjacent or got invalidated by changes; recompute next think
      clearPlan(enemy);
      continue;
    }

    enemy.nextDirection = dir;
    // enemy.pathIndex += 1;
  }
}
