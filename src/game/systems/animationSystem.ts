import { combineEntities } from "../../utils/combineEntities";
import type { WorldState } from "../types/WorldState";

const WALK_FRAME_MS = 3000;

export function animationSystem(world: WorldState, dtMs: number) {
  for (const entity of combineEntities(world)) {
    if (entity.hp <= 0) continue;

    const isMoving = entity.targetR !== null && entity.targetC !== null;

    entity.animationTimeMs += dtMs;
    if (!isMoving && entity.animationTimeMs >= WALK_FRAME_MS) {
      entity.animationTimeMs -= WALK_FRAME_MS;
      entity.animationFrame = entity.animationFrame === 0 ? 1 : 0;
      continue;
    }

    while (entity.animationTimeMs >= WALK_FRAME_MS) {
      entity.animationTimeMs -= WALK_FRAME_MS;
      entity.animationFrame = entity.animationFrame === 0 ? 1 : 0;
    }
  }
}
