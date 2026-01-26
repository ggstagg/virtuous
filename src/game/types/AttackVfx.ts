import type { Direction } from "./Direction";

export type AttackVfx = {
  id: string;
  r: number;
  c: number;
  direction: Direction;
  ageMs: number;
  ttlMs: number;
};
