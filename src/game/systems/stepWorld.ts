import type { WorldState } from "../types/WorldState";
import { animationSystem } from "./animationSystem";
import { deathSystem } from "./deathSystem";
import { enemyAISystem } from "./enemySystems/enemyAISystem";
import { enemyAttackSystem } from "./enemySystems/enemyAttackSystem";
import { enemyMovementSystem } from "./enemySystems/enemyMovementSystem";
import { healthSystem } from "./healthSystem";
import type { InputState } from "./inputSystem";
import { itemPickupSystem } from "./itemSystems/itemPickupSystem";
import { neutralAISystem } from "./neutralSystems/neutralAISystem";
import { neutralMovementSystem } from "./neutralSystems/neutralMovementSystem";
import { playerAttackSystem } from "./playerSystems/playerAttackSystem";
import { playerMovementSystem } from "./playerSystems/playerMovementSystem";

export function stepWorld(world: WorldState, input: InputState, dtMs: number) {
  if (world.gameOver) return;

  playerAttackSystem(world, input, dtMs);
  playerMovementSystem(world, input, dtMs);
  itemPickupSystem(world);

  enemyAISystem(world, dtMs);
  neutralAISystem(world, dtMs);

  enemyMovementSystem(world, dtMs);
  neutralMovementSystem(world, dtMs);
  animationSystem(world, dtMs);

  enemyAttackSystem(world, dtMs);
  deathSystem(world);

  healthSystem(world, dtMs);

  world.tick += 1;
}
