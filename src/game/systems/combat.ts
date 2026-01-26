import { DIRECTIONS, type Direction } from "../types/Direction";
import type { EntityBase } from "../types/EntityBase";
import type { WorldState } from "../types/WorldState";
import { pushEvent } from "./eventLog";

export function applyDamage(
  world: WorldState,
  target: EntityBase,
  source: EntityBase,
  damage: number,
) {
  if (target.invulnerabilityMs > 0) return;

  const prevHp = target.hp;
  target.hp = Math.max(0, target.hp - damage);

  const dealt = prevHp - target.hp;
  if (dealt <= 0) return;

  pushEvent(world, "bad", `${target.id} took ${dealt} damage`);

  if (target.kind === "neutral") {
    target.isScared = true;
    target.attackedByEntityId = source.id;
    target.scaredCooldownMs = target.scaredIntervalMs;
  }

  if (target.hp <= 0) {
    pushEvent(world, "bad", `${target.id} died`);
  }
  target.invulnerabilityMs = target.maxInvulnerabilityMs;
  pushAttackVfx(world, source.r, source.c, source.facing ?? DIRECTIONS.North);
}

export function pushAttackVfx(
  world: WorldState,
  r: number,
  c: number,
  direction: Direction,
  ttlMs: number = 140,
) {
  world.attackVfx.push({
    id: `${Date.now()}-vfx`,
    r,
    c,
    direction,
    ageMs: 0,
    ttlMs,
  });
}
