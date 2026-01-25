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

type Threat = { r: number; c: number; id: string };

function getThreatForNeutral(
  world: WorldState,
  neutral: Neutral,
): Threat | null {
  if (
    neutral.scaredCooldownMs > 0 &&
    neutral.attackedByEntityId === world.player.id
  ) {
    return { r: world.player.r, c: world.player.c, id: world.player.id };
  }
  const nearestEnemy = pickNearestEnemy(world, neutral);
  if (!nearestEnemy) return null;
  if (nearestEnemy.distance > neutral.visionRadius) return null;

  return {
    r: nearestEnemy.enemy.r,
    c: nearestEnemy.enemy.c,
    id: nearestEnemy.enemy.id,
  };
}

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
  threatR: number,
  threatC: number,
): Direction | null {
  let bestScore = -Infinity;
  const bestDirs: Direction[] = [];

  const relativeR = neutral.r - threatR;
  const relativeC = neutral.c - threatC;

  for (const direction of Object.values(DIRECTIONS)) {
    const { dr, dc } = DirectionDelta[direction];
    const nextR = neutral.r + dr;
    const nextC = neutral.c + dc;

    if (!inBounds(world, nextR, nextC)) continue;

    const tile = world.grid[nextR][nextC];
    if (!tile.isWalkable || tile.entityId) continue;

    const distance = manhattanDistance(nextR, nextC, threatR, threatC);

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

    neutral.scaredCooldownMs = Math.max(0, neutral.scaredCooldownMs - dtMs);
    if (neutral.scaredCooldownMs === 0) neutral.attackedByEntityId = null;

    neutral.thinkCooldownMs -= dtMs;
    if (neutral.thinkCooldownMs > 0) continue;
    if (neutral.targetR !== null && neutral.targetC !== null) continue;

    neutral.thinkCooldownMs = neutral.thinkIntervalMs;

    const threat = getThreatForNeutral(world, neutral);

    if (!threat) {
      neutral.isScared = false;

      if (Math.random() < 0.7) {
        neutral.nextDirection = null;
        continue;
      }

      const direction =
        Object.values(DIRECTIONS)[
          (Math.random() * Object.values(DIRECTIONS).length) | 0
        ];
      neutral.nextDirection = direction;
      continue;
    }

    const distanceToThreat = manhattanDistance(
      neutral.r,
      neutral.c,
      threat.r,
      threat.c,
    );
    neutral.isScared =
      distanceToThreat <= neutral.visionRadius || neutral.scaredCooldownMs > 0;

    const fleeDirection = pickFleeDirection(world, neutral, threat.r, threat.c);
    neutral.nextDirection = fleeDirection;
  }
}
