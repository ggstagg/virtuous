import { TILE_SIZE } from "../constants/viewConstants";
import type { EntityBase } from "../types/EntityBase";
import { drawDirectionArrow } from "./drawDirectionArrow";

export function drawEntity(
  ctx: CanvasRenderingContext2D,
  entity: EntityBase,
  color: string
) {
  let drawR = entity.r;
  let drawC = entity.c;

  if (entity.targetR !== null && entity.targetC !== null) {
    const t =
      entity.moveDurationMs <= 0
        ? 1
        : Math.min(1, entity.moveProgressMs / entity.moveDurationMs);

    drawR = entity.startR + (entity.targetR - entity.startR) * t;
    drawC = entity.startC + (entity.targetC - entity.startC) * t;
  }

  const px = drawC * TILE_SIZE;
  const py = drawR * TILE_SIZE;

  ctx.fillStyle = color;
  ctx.fillRect(px + 3, py + 3, TILE_SIZE - 6, TILE_SIZE - 6);

  // arrow to indicate direction of travel
  const centerX = px + TILE_SIZE / 2;
  const centerY = py + TILE_SIZE / 2;

  drawDirectionArrow(ctx, centerX, centerY, TILE_SIZE * 0.25, entity.facing);
}