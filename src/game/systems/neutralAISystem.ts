import { DIRECTIONS } from "../types/Direction";
import type { WorldState } from "../types/WorldState";

export function neutralAISystem(world: WorldState, dtMs: number) {
  for (const neutral of Object.values(world.neutrals)) {
    neutral.thinkCooldownMs -= dtMs;
    if (neutral.thinkCooldownMs > 0) continue;
    if (neutral.targetR !== null && neutral.targetC !== null) continue;

    neutral.thinkCooldownMs = neutral.thinkIntervalMs;

    if (Math.random() < 0) {
      neutral.nextDirection = null;
      continue;
    }

    const direction =
      Object.values(DIRECTIONS)[
        (Math.random() * Object.values(DIRECTIONS).length) | 0
      ];
    neutral.nextDirection = direction;
  }
}
