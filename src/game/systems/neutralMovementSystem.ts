import type { WorldState } from "../types/WorldState";
import { stepEntityMovement } from "./movementHelpers";

export function neutralMovementSystem(world: WorldState, dtMs: number) {
  for (const neutral of Object.values(world.neutrals)) {
    const wasMoving = neutral.targetR !== null && neutral.targetC !== null;

    if (wasMoving) {
      stepEntityMovement(world, neutral, dtMs, () => null);
      continue;
    }

    stepEntityMovement(world, neutral, dtMs, () => {
      const direction = neutral.nextDirection;
      neutral.nextDirection = null;
      return direction;
    });
  }
}
