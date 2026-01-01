import type { WorldState } from "../types/WorldState";
import type { InputState } from "./inputSystem";
import { DirectionDelta, type Direction } from "../types/Direction";

function inBounds(world: WorldState, r: number, c: number) {
  return (
    r >= 0 &&
    c >= 0 &&
    r < world.grid.length &&
    c < (world.grid[0]?.length ?? 0)
  );
}

function isWalkable(world: WorldState, r: number, c: number) {
  const tile = world.grid[r][c];
  return tile.isWalkable && tile.entityId === null;
}

function pickDirection(input: InputState): Direction | null {
  if (input.heldDirections.size === 0) return null;

  let last: Direction | null = null;
  for (const direction of input.heldDirections) last = direction;
  return last;
}

export function movementSystem(
  world: WorldState,
  input: InputState,
  dtMs: number
) {
  const p = world.player;

  p.moveCooldownMs = Math.max(0, p.moveCooldownMs - dtMs);

  // if currently interpolating, advance progress and finish move when done
  if (p.targetR !== null && p.targetC !== null) {
    p.moveProgressMs = Math.min(p.moveDurationMs, p.moveProgressMs + dtMs);

    if (p.moveProgressMs >= p.moveDurationMs) {
      const oldR = p.r;
      const oldC = p.c;

      p.r = p.targetR;
      p.c = p.targetC;

      p.startR = p.r;
      p.startC = p.c;
      p.targetR = null;
      p.targetC = null;
      p.moveProgressMs = 0;

      if (world.grid[oldR]?.[oldC]?.entityId === p.id) {
        world.grid[oldR][oldC].entityId = null;
      }
      world.grid[p.r][p.c].entityId = p.id;
    }
    return;
  }

  // if not moving and cooldown <= 0, consume input (if any)
  if (p.moveCooldownMs > 0) return;

  const direction = pickDirection(input);
  if (!direction) return;

  const { dr, dc } = DirectionDelta[direction];
  const nextR = p.r + dr;
  const nextC = p.c + dc;

  p.facing = direction;

  if (!inBounds(world, nextR, nextC)) return;
  if (!isWalkable(world, nextR, nextC)) return;

  p.startR = p.r;
  p.startC = p.c;
  p.targetR = nextR;
  p.targetC = nextC;
  p.moveProgressMs = 0;

  p.moveCooldownMs = p.moveDurationMs;
}
