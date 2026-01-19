import type { EntityBase } from "../types/EntityBase";
import type { WorldState } from "../types/WorldState";
import { pushEvent } from "./eventLog";

export function applyDamage(
  world: WorldState,
  target: EntityBase,
  damage: number,
) {
  if (target.invulnerabilityMs <= 0) {
    const prevHp = target.hp;
    target.hp = Math.max(0, target.hp - damage);

    const dealt = prevHp - target.hp;
    if (dealt > 0) {
      pushEvent(world, "bad", `${target.id} took ${dealt} damage`);
    }

    if (target.hp === 0) {
      pushEvent(world, "bad", `${target.id} died`);
    }
    target.invulnerabilityMs = target.maxInvulnerabilityMs;
  }
}
