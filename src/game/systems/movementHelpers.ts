import type { WorldState } from "../types/WorldState";
import { DirectionDelta, type Direction } from "../types/Direction";
import type { Entity } from "../types/EntityBase";

type MoveEntity = {
  id: string;
  r: number;
  c: number;

  startR: number;
  startC: number;
  targetR: number | null;
  targetC: number | null;

  moveSpeed: number;
  baseMovementDurationMs: number;

  moveCooldownMs: number;
  moveDurationMs: number;
  moveProgressMs: number;

  facing: Direction;
};

export function inBounds(world: WorldState, r: number, c: number) {
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

function clamp(value: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, value));
}

function getStepDurationMs(entity: MoveEntity): number {
  const speed = Math.max(0.05, entity.moveSpeed || 0);
  const base = Math.max(1, entity.baseMovementDurationMs || 1);
  return clamp(base / speed, 16, 1000);
}

export function stepEntityMovement(
  world: WorldState,
  entity: Entity,
  dtMs: number,
  getDirection: () => Direction | null,
): boolean {
  entity.moveCooldownMs = Math.max(0, entity.moveCooldownMs - dtMs);

  // If currently interpolating, advance progress and finish move when done
  if (entity.targetR !== null && entity.targetC !== null) {
    const stepMs = Math.max(1, entity.moveDurationMs || 1);

    entity.moveProgressMs = Math.min(stepMs, entity.moveProgressMs + dtMs);

    if (entity.moveProgressMs >= entity.moveDurationMs) {
      entity.startR = entity.r;
      entity.startC = entity.c;

      entity.targetR = null;
      entity.targetC = null;
      entity.moveProgressMs = 0;
      entity.animationFrame = ((entity.animationFrame ?? 0) ^ 1) as 0 | 1;
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

  if (!inBounds(world, nextR, nextC)) {
    console.log("out of bounds");
    return false;
  }
  if (!isWalkable(world, nextR, nextC)) {
    console.log("not walkable");
    return false;
  }

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

  entity.r = entity.targetR;
  entity.c = entity.targetC;

  entity.moveProgressMs = 0;

  const stepMs = getStepDurationMs(entity);
  entity.moveDurationMs = stepMs;
  entity.moveCooldownMs = stepMs;

  return true;
}
