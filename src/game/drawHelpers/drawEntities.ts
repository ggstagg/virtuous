import { COLORS } from "../constants/colorConstants";
import type { WorldState } from "../types/WorldState";
import { drawEnemyVision } from "./drawEnemyVision";
import { drawEntity } from "./drawEntity";

export function drawEntities(ctx: CanvasRenderingContext2D, world: WorldState) {
  drawEntity(ctx, world.player, COLORS.player);

  for (const enemy of Object.values(world.enemies)) {
    drawEntity(ctx, enemy, COLORS.enemy);
  }

  for (const enemy of Object.values(world.enemies))
    drawEnemyVision(ctx, world, enemy);

  for (const neutral of Object.values(world.neutrals)) {
    drawEntity(ctx, neutral, COLORS.neutral);
  }
}
