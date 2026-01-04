import type { WorldState } from "../types/WorldState";
import type { Enemy } from "../types/Enemy";
import { DIRECTIONS, type Direction } from "../types/Direction";

function sign(n: number) {
  return n === 0 ? 0 : n > 0 ? 1 : -1;
}

// step toward player by reducing Manhattan distance
function manhattanDistance(r1: number, c1: number, r2: number, c2: number) {
  return Math.abs(r1 - r2) + Math.abs(c1 - c2);
}

function chooseChaseDir(
  enemy: Enemy,
  pr: number,
  pc: number
): Direction | null {
  const dr = pr - enemy.r;
  const dc = pc - enemy.c;

  // prefer axis with bigger distance
  if (Math.abs(dc) >= Math.abs(dr)) {
    const s = sign(dc);
    if (s === 1) return DIRECTIONS.East;
    if (s === -1) return DIRECTIONS.West;
  } else {
    const s = sign(dr);
    if (s === 1) return DIRECTIONS.South;
    if (s === -1) return DIRECTIONS.North;
  }

  return null;
}

export function enemyAISystem(world: WorldState, dtMs: number) {
  const p = world.player;

  for (const enemy of Object.values(world.enemies)) {
    enemy.thinkCooldownMs -= dtMs;
    if (enemy.thinkCooldownMs > 0) continue;

    enemy.thinkCooldownMs = enemy.thinkIntervalMs;

    const dist = manhattanDistance(enemy.r, enemy.c, p.r, p.c);
    if (dist > enemy.visionRadius) {
      enemy.nextDirection = null;
      continue;
    }

    // just choose player for now
    const direction = chooseChaseDir(enemy, p.r, p.c);
    enemy.nextDirection = direction;
  }
}
