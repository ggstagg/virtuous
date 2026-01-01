import type { WorldState } from "../types/WorldState";
import type { InputState } from "./inputSystem";
import { movementSystem } from "./movementSystem";

export function stepWorld(world: WorldState, input: InputState, dtMs: number) {
  movementSystem(world, input, dtMs);
  world.tick += 1;
}
