import { DIRECTIONS } from "../types/Direction";
import type { Enemy } from "../types/Enemy";
import type { StatusEffect } from "../types/StatusEffect";

export function createDefaultEnemy(id: string, r: number, c: number): Enemy {
  const statusEffects: StatusEffect[] = [];

  return {
    id,
    r,
    c,

    hp: 10,
    maxHp: 10,
    attackPower: 2,
    defensePower: 0,

    facing: DIRECTIONS.South,
    moveSpeed: 0.8,
    targetR: null,
    targetC: null,

    startR: r,
    startC: c,

    moveCooldownMs: 200,
    moveDurationMs: 200,
    moveProgressMs: 0,

    gold: 0,
    food: 0,
    inventory: [],

    isAggroed: false,
    isScared: false,
    isIntimidated: false,

    visionRadius: 8,

    statusEffects,

    behaviorType: "chaser",

    thinkCooldownMs: 0,
    thinkIntervalMs: 200,

    targetEntityId: "test-player",
    nextDirection: null,
  };
}
