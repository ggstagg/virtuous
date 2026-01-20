import { DIRECTIONS, type Direction } from "../types/Direction";
import type { Neutral, NeutralEntityType } from "../types/Neutral";
import type { SocialGroup } from "../types/SocialGroup";
import type { StatusEffect } from "../types/StatusEffect";

export function createDefaultNeutral(
  id: string,
  r: number,
  c: number,
  neutralType: NeutralEntityType = "villager",
  socialGroup: SocialGroup = "villager",
): Neutral {
  const statusEffects: StatusEffect[] = [];

  return {
    id,
    r,
    c,
    hp: 10,
    maxHp: 10,
    attackPower: 0,
    defensePower: 0,

    facing: DIRECTIONS.South as Direction,
    moveSpeed: 0.6,
    targetR: null,
    targetC: null,

    startR: r,
    startC: c,

    moveCooldownMs: 300,
    moveDurationMs: 300,
    moveProgressMs: 0,

    gold: 10,
    food: 30,
    inventory: [],

    isAggroed: false,
    isScared: false,
    isIntimidated: false,

    visionRadius: 4,
    statusEffects,
    invulnerabilityMs: 0,
    maxInvulnerabilityMs: 300,

    socialGroup,

    bravery: 10,
    happiness: 10,

    neutralEntityType: neutralType,

    thinkCooldownMs: 0,
    thinkIntervalMs: 200,
    nextDirection: null,
  };
}
