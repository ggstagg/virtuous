import type { Enemy } from "../../types/Enemy";
import type { WorldState } from "../../types/WorldState";
import { stepEntityMovement } from "../movementHelpers";

function clearPlan(enemy: Enemy) {
  enemy.currentPath = null;
  enemy.pathIndex = 0;
  enemy.nextDirection = null;
  enemy.wanderDirection = null;
}

export function enemyMovementSystem(world: WorldState, dtMs: number) {
  for (const enemy of Object.values(world.enemies)) {
    const wasMoving = enemy.targetR !== null && enemy.targetC !== null;

    // If mid-move, just advance interpolation
    if (wasMoving) {
      stepEntityMovement(world, enemy, dtMs, () => null);
      continue;
    }

    const hadDir = enemy.nextDirection !== null;
    const wasChasing = enemy.currentPath !== null;

    const started = stepEntityMovement(world, enemy, dtMs, () => {
      const d = enemy.nextDirection;
      enemy.nextDirection = null;
      return d;
    });

    if (!hadDir) continue;

    if (started) {
      // move successfully started, consume exactly one path step
      if (wasChasing) enemy.pathIndex += 1;
    } else {
      // tried to move but couldn't (blocked/out of bounds)
      clearPlan(enemy);
    }
  }
}
