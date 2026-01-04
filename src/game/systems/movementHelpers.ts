import type { WorldState } from "../types/WorldState";
import { DirectionDelta, type Direction } from "../types/Direction";

type MoveEntity = {
  id: string;
  r: number;
  c: number;

  startR: number;
  startC: number;
  targetR: number | null;
  targetC: number | null;

  moveCooldownMs: number;
  moveDurationMs: number;
  moveProgressMs: number;

  facing: Direction;
};

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

// if currently interpolating, advance progress and finish move when done
export function stepEntityMovement(
  world: WorldState,
  entity: MoveEntity,
  dtMs: number,
  getDirection: () => Direction | null
): boolean {
  entity.moveCooldownMs = Math.max(0, entity.moveCooldownMs - dtMs);

  // If currently interpolating, advance progress and finish move when done
  if (entity.targetR !== null && entity.targetC !== null) {
    entity.moveProgressMs = Math.min(
      entity.moveDurationMs,
      entity.moveProgressMs + dtMs
    );

    if (entity.moveProgressMs >= entity.moveDurationMs) {
      // Commit logical position; occupancy was already handled at move start
      entity.r = entity.targetR;
      entity.c = entity.targetC;

      entity.startR = entity.r;
      entity.startC = entity.c;
      entity.targetR = null;
      entity.targetC = null;
      entity.moveProgressMs = 0;
    }
    return true;
  }

  // If not moving and cooldown <= 0, consume direction
  if (entity.moveCooldownMs > 0) return false;

  const direction = getDirection();
  if (!direction) return false;

  const { dr, dc } = DirectionDelta[direction];
  const nextR = entity.r + dr;
  const nextC = entity.c + dc;

  entity.facing = direction;

  if (!inBounds(world, nextR, nextC)) return true;
  if (!isWalkable(world, nextR, nextC)) return true;

  const fromR = entity.r;
  const fromC = entity.c;

  // free current space and occupy next space to prevent entities from
  // entering the same space as each other
  if (world.grid[fromR]?.[fromC]?.entityId === entity.id) {
    world.grid[fromR][fromC].entityId = null;
  }

  world.grid[nextR][nextC].entityId = entity.id;

  // Start move
  entity.startR = fromR;
  entity.startC = fromC;
  entity.targetR = nextR;
  entity.targetC = nextC;
  entity.moveProgressMs = 0;

  entity.moveCooldownMs = entity.moveDurationMs;
  return true;
}
