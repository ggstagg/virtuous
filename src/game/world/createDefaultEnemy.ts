import { bfsPathfinder } from "../systems/pathfinding/bfs";
import { DIRECTIONS } from "../types/Direction";
import type { Enemy } from "../types/Enemy";
import type { StatusEffect } from "../types/StatusEffect";

export function createDefaultEnemy(id: string, r: number, c: number): Enemy {
  const statusEffects: StatusEffect[] = [];

  return {
    id,
    kind: "enemy",
    r,
    c,

    hp: 10,
    maxHp: 10,
    attackPower: 2,
    defensePower: 0,

    facing: DIRECTIONS.South,
    moveSpeed: 0.9,
    baseMovementDurationMs: 200,

    targetR: null,
    targetC: null,

    startR: r,
    startC: c,

    moveCooldownMs: 0,
    moveDurationMs: 200,
    moveProgressMs: 0,
    animationFrame: 0,
    animationTimeMs: 0,

    gold: 0,
    food: 0,
    inventory: [],

    isAggroed: false,
    isScared: false,
    attackedByEntityId: null,
    scaredCooldownMs: 0,
    scaredIntervalMs: 0,
    isIntimidated: false,

    visionRadius: 8,

    statusEffects,
    invulnerabilityMs: 0,
    maxInvulnerabilityMs: 100,

    behaviorType: "chaser",

    thinkCooldownMs: 0,
    thinkIntervalMs: 150,

    attackCooldownMs: 200,
    attackIntervalMs: 200,

    targetEntityId: "test-player",
    nextDirection: null,

    wanderCooldownMs: 300,
    wanderIntervalMs: 300,
    wanderDirection: null,

    pathfinder: bfsPathfinder,
    currentPath: null,
    pathIndex: 0,
    pathGoalR: null,
    pathGoalC: null,
  };
}
