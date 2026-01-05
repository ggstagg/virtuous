import type { WorldState } from "../types/WorldState";
import { enemyAISystem } from "./enemyAISystem";
import { enemyMovementSystem } from "./enemyMovementSystem";
import { healthSystem } from "./healthSystem";
import type { InputState } from "./inputSystem";
import { itemPickupSystem } from "./itemPickupSystem";
import { neutralAISystem } from "./neutralAISystem";
import { neutralMovementSystem } from "./neutralMovementSystem";
import { playerMovementSystem } from "./playerMovementSystem";

export function stepWorld(world: WorldState, input: InputState, dtMs: number) {
  if (world.gameOver) return;

  playerMovementSystem(world, input, dtMs);
  itemPickupSystem(world);

  enemyAISystem(world, dtMs);
  enemyMovementSystem(world, dtMs);

  neutralAISystem(world, dtMs);
  neutralMovementSystem(world, dtMs);

  healthSystem(world, dtMs);

  world.tick += 1;
}
