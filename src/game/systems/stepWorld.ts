import type { WorldState } from "../types/WorldState";
import { enemyAISystem } from "./enemyAISystem";
import { enemyMovementSystem } from "./enemyMovementSystem";
import type { InputState } from "./inputSystem";
import { itemPickupSystem } from "./itemPickupSystem";
import { playerMovementSystem } from "./playerMovementSystem";

export function stepWorld(world: WorldState, input: InputState, dtMs: number) {
  playerMovementSystem(world, input, dtMs);
  itemPickupSystem(world);

  enemyAISystem(world, dtMs);
  enemyMovementSystem(world, dtMs);

  world.tick += 1;
}
