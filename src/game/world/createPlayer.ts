import { DIRECTIONS } from "../types/Direction";
import type { Player } from "../types/Player";
import type { StatusEffect } from "../types/StatusEffect";

export function createDefaultPlayer(): Player {
  const statusEffects: StatusEffect[] = [];

  return {
    id: "test-player",
    kind: "player",
    r: 2,
    c: 2,

    hp: 20,
    maxHp: 20,
    attackPower: 5,
    defensePower: 2,

    facing: DIRECTIONS.East,
    moveSpeed: 0.8,
    baseMovementDurationMs: 120,

    startR: 2,
    startC: 2,
    targetR: null,
    targetC: null,
    moveProgressMs: 0,
    animationFrame: 0,
    animationTimeMs: 0,

    moveCooldownMs: 120,
    moveDurationMs: 120,

    gold: 0,
    food: 5,
    inventory: [],

    isAggroed: false,
    isScared: false,
    scaredCooldownMs: 0,
    scaredIntervalMs: 10000,
    attackedByEntityId: null,
    isIntimidated: false,

    visionRadius: 5,

    statusEffects,

    virtuePoints: 0,
    vicePoints: 0,

    attackCooldownMs: 0,
    attackIntervalMs: 250,

    invulnerabilityMs: 0,
    maxInvulnerabilityMs: 400,
  };
}
