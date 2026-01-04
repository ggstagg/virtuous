import type { WorldState } from "../types/WorldState";
import { stepEntityMovement } from "./movementHelpers";

export function enemyMovementSystem(world: WorldState, dtMs: number) {
  for (const enemy of Object.values(world.enemies)) {
    stepEntityMovement(world, enemy, dtMs, () => {
      const direction = enemy.nextDirection;
      enemy.nextDirection = null; 
      return direction;
    });
  }
}
