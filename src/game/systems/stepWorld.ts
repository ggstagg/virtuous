import type { WorldState } from "../types/WorldState";
import type { InputState } from "./inputSystem";
import { itemPickupSystem } from "./itemPickupSystem";
import { movementSystem } from "./movementSystem";

export function stepWorld(world: WorldState, input: InputState, dtMs: number) {
  movementSystem(world, input, dtMs);
  itemPickupSystem(world);
  world.tick += 1;
}
