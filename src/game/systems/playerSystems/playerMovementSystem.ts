import type { WorldState } from "../../types/WorldState";
import type { InputState } from "../inputSystem";
import type { Direction } from "../../types/Direction";
import { stepEntityMovement } from "../movementHelpers";

function pickDirection(input: InputState): Direction | null {
  if (input.heldDirections.size === 0) return null;
  let last: Direction | null = null;
  for (const direction of input.heldDirections) last = direction;
  return last;
}

export function playerMovementSystem(
  world: WorldState,
  input: InputState,
  dtMs: number,
) {
  stepEntityMovement(world, world.player, dtMs, () => pickDirection(input));
}
