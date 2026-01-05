import { DIRECTIONS, type Direction } from "../types/Direction";
import type { Neutral, NeutralEntityType } from "../types/Neutral";
import type { SocialGroup } from "../types/SocialGroup";
import type { StatusEffect } from "../types/StatusEffect";

export function createDefaultNeutral(
  id: string,
  r: number,
  c: number,
  neutralType: NeutralEntityType = "villager",
  socialGroup: SocialGroup = "villager"
): Neutral {
  const statusEffects: StatusEffect[] = [];

  return {
    id,
    r,
    c,
    hp: 5,
    maxHp: 5,
    attackPower: 0,
    defensePower: 0,

    facing: DIRECTIONS.South as Direction,
    moveSpeed: 0.6,
    targetR: null,
    targetC: null,

    startR: r,
    startC: c,

    moveCooldownMs: 350,
    moveDurationMs: 350,
    moveProgressMs: 0,

    gold: 0,
    food: 0,
    inventory: [],

    isAggroed: false,
    isScared: false,
    isIntimidated: false,

    visionRadius: 4,
    statusEffects,

    socialGroup,

    bravery: 10,
    happiness: 10,

    neutralEntityType: neutralType,

    thinkCooldownMs: 0,
    thinkIntervalMs: 600,
    nextDirection: null,
  };
}
