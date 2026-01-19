import {
  DirectionDelta,
  DIRECTIONS,
  type Direction,
} from "../../types/Direction";
import type { Enemy } from "../../types/Enemy";
import type { Neutral } from "../../types/Neutral";
import type { WorldState } from "../../types/WorldState";
import { inBounds } from "../movementHelpers";
import { manhattanDistance } from "../pathfinding/manhattan";

function pickNearestEnemy(
  world: WorldState,
  neutral: Neutral,
): { enemy: Enemy; distance: number } | null {
  let closestEnemy: { enemy: Enemy; distance: number } | null = null;

  for (const enemy of Object.values(world.enemies)) {
    if (enemy.hp <= 0) continue;
    const enemyDistance = manhattanDistance(
      neutral.r,
      neutral.c,
      enemy.r,
      enemy.c,
    );

    if (!closestEnemy || closestEnemy.distance > enemyDistance)
      closestEnemy = { enemy, distance: enemyDistance };
  }

  return closestEnemy;
}

function pickFleeDirection(
  world: WorldState,
  neutral: Neutral,
  enemy: Enemy,
): Direction | null {
  let bestScore = -Infinity;
  const bestDirs: Direction[] = [];

  const relativeR = neutral.r - enemy.r;
  const relativeC = neutral.c - enemy.c;

  for (const direction of Object.values(DIRECTIONS)) {
    const { dr, dc } = DirectionDelta[direction];
    const nextR = neutral.r + dr;
    const nextC = neutral.c + dc;

    if (!inBounds(world, nextR, nextC)) continue;

    const tile = world.grid[nextR][nextC];
    if (!tile.isWalkable || tile.entityId) continue;

    const distance = manhattanDistance(nextR, nextC, enemy.r, enemy.c);

    const away = dr * relativeR + dc * relativeC;

    // discourage immediate reversal
    const reversePenalty =
      neutral.facing &&
      DirectionDelta[neutral.facing].dr === -dr &&
      DirectionDelta[neutral.facing].dc === -dc
        ? -0.25
        : 0;

    // distance is most important
    const score = distance + 0.2 * away + reversePenalty;

    if (score > bestScore) {
      bestScore = score;
      bestDirs.length = 0;
      bestDirs.push(direction);
    } else if (score === bestScore) {
      bestDirs.push(direction);
    }
  }

  if (bestDirs.length === 0) return null;

  // try to keep running the same direction if possible
  if (neutral.nextDirection && bestDirs.includes(neutral.nextDirection))
    return neutral.nextDirection;

  return bestDirs[(Math.random() * bestDirs.length) | 0];
}

export function neutralAISystem(world: WorldState, dtMs: number) {
  for (const neutral of Object.values(world.neutrals)) {
    if (neutral.hp <= 0) continue;

    neutral.thinkCooldownMs -= dtMs;
    if (neutral.thinkCooldownMs > 0) continue;
    if (neutral.targetR !== null && neutral.targetC !== null) continue;

    neutral.thinkCooldownMs = neutral.thinkIntervalMs;

    const nearestEnemy = pickNearestEnemy(world, neutral);

    if (!nearestEnemy || nearestEnemy.distance > neutral.visionRadius) {
      if (Math.random() < 0.5) {
        neutral.nextDirection = null;
        continue;
      }

      const direction =
        Object.values(DIRECTIONS)[
          (Math.random() * Object.values(DIRECTIONS).length) | 0
        ];
      neutral.isScared = false;
      neutral.nextDirection = direction;
      continue;
    }

    neutral.isScared = true;

    console.log("entering flee direction");
    const fleeDirection = pickFleeDirection(world, neutral, nearestEnemy.enemy);
    console.log(`${neutral.id} chose to flee towards the ${fleeDirection}`);
    neutral.nextDirection = fleeDirection;
  }
}
