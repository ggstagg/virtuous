import { DIRECTIONS } from "../types/Direction";
import type { Player } from "../types/Player";
import type { StatusEffect } from "../types/StatusEffect";

export function createDefaultPlayer(): Player {
  const statusEffects: StatusEffect[] = [];

  return {
    id: "test-player",
    r: 2,
    c: 2,

    hp: 20,
    maxHp: 20,
    attackPower: 5,
    defensePower: 2,

    facing: DIRECTIONS.South,
    moveSpeed: 1,

    startR: 2,
    startC: 2,
    targetR: null,
    targetC: null,
    moveProgressMs: 0,

    moveCooldownMs: 120,
    moveDurationMs: 120,

    gold: 0,
    food: 5,
    inventory: [],

    isAggroed: false,
    isScared: false,
    isIntimidated: false,

    visionRadius: 5,

    statusEffects,

    virtuePoints: 0,
    vicePoints: 0,

    invulnerabilityMs: 0,
    maxInvulnerabilityMs: 400,
  };
}
