import {
  DirectionDelta,
  DIRECTIONS,
  type Direction,
} from "../../types/Direction";
import type { Enemy } from "../../types/Enemy";
import type { WorldState } from "../../types/WorldState";
import { inBounds } from "../movementHelpers";

function isReverse(a: Direction, b: Direction) {
  const da = DirectionDelta[a];
  const db = DirectionDelta[b];
  return da.dr === -db.dr && da.dc === -db.dc;
}

export function pickWanderDirection(
  world: WorldState,
  enemy: Enemy,
): Direction | null {
  const dirs = Object.values(DIRECTIONS);
  const options: { d: Direction; w: number }[] = [];

  for (const d of dirs) {
    const { dr, dc } = DirectionDelta[d];
    const nr = enemy.r + dr;
    const nc = enemy.c + dc;

    if (!inBounds(world, nr, nc)) continue;

    const tile = world.grid[nr][nc];
    if (!tile.isWalkable || tile.entityId) continue;

    let w = 1.0;

    if (d === enemy.facing) w += 0.7;

    if (isReverse(d, enemy.facing)) w -= 0.35;

    w += Math.random() * 0.3;

    if (w < 0.05) w = 0.05;

    options.push({ d, w });
  }

  if (options.length === 0) return null;

  // weighted pick
  const total = options.reduce((s, o) => s + o.w, 0);
  let roll = Math.random() * total;
  for (const o of options) {
    roll -= o.w;
    if (roll <= 0) return o.d;
  }
  return options[options.length - 1]!.d;
}
