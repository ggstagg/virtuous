import type { Direction } from "./Direction";
import type { Item } from "./Item";
import type { StatusEffect } from "./StatusEffect";

export interface EntityBase {
  id: string;
  r: number;
  c: number;

  hp: number;
  maxHp: number;
  attackPower: number;
  defensePower: number;

  facing: Direction;
  moveSpeed: number;
  targetR: number | null;
  targetC: number | null;

  gold: number;
  food: number;
  inventory: Item[];

  isAggroed: boolean;
  isScared: boolean;
  isIntimidated: boolean;

  visionRadius: number;

  statusEffects: StatusEffect[];
}
