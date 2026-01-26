import type { AttackVfx } from "../types/AttackVfx";
import type { WorldState } from "../types/WorldState";

export function attackVfxSystem(world: WorldState, dtMs: number) {
  const out: AttackVfx[] = [];
  for (const vfx of world.attackVfx) {
    const age = vfx.ageMs + dtMs;
    if (age < vfx.ttlMs) out.push({ ...vfx, ageMs: age });
  }
  world.attackVfx = out;
}
