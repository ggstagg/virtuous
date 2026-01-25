import type { Direction } from "./Direction";
import type { Enemy } from "./Enemy";
import type { Item } from "./Item";
import type { Neutral } from "./Neutral";
import type { Player } from "./Player";
import type { StatusEffect } from "./StatusEffect";

export type EntityKind = "player" | "enemy" | "neutral";

export interface EntityBase {
  id: string;
  kind: EntityKind;

  r: number;
  c: number;

  hp: number;
  maxHp: number;
  attackPower: number;
  defensePower: number;

  facing: Direction;

  moveSpeed: number;
  baseMovementDurationMs: number;

  targetR: number | null;
  targetC: number | null;
  startR: number;
  startC: number;

  moveCooldownMs: number;
  moveDurationMs: number;
  moveProgressMs: number;

  gold: number;
  food: number;
  inventory: Item[];

  isAggroed: boolean;
  isScared: boolean;
  scaredCooldownMs: number;
  scaredIntervalMs: number;
  attackedByEntityId: string | null;
  isIntimidated: boolean;

  visionRadius: number;

  statusEffects: StatusEffect[];
  invulnerabilityMs: number;
  maxInvulnerabilityMs: number;
}

export type Entity = Player | Enemy | Neutral;
