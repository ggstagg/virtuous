import { COLORS } from "../../constants/colorConstants";
import type { WorldState } from "../../types/WorldState";
import { debugDrawEnemyVision } from "./debugDrawEnemyVision";
import { debugDrawEntity } from "./debugDrawEntity";

export function debugDrawEntities(
  ctx: CanvasRenderingContext2D,
  world: WorldState,
) {
  debugDrawEntity(ctx, world.player, COLORS.player);

  for (const enemy of Object.values(world.enemies)) {
    debugDrawEntity(ctx, enemy, COLORS.enemy);
  }

  for (const enemy of Object.values(world.enemies))
    debugDrawEnemyVision(ctx, world, enemy);

  for (const neutral of Object.values(world.neutrals)) {
    debugDrawEntity(ctx, neutral, COLORS.neutral);
  }
}
