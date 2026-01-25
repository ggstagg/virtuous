import { TILE_SIZE } from "../../constants/viewConstants";
import type { Tile } from "../../types/Tile";
import type { WorldState } from "../../types/WorldState";
import { drawSpriteCell } from "../sprites/drawSpriteCell";
import {
  BUNDLE_BASE,
  FLOOR_BASE,
  FOOD_BASE,
  GOLD_BASE,
  KEY_BASE,
  WALL_BASE,
} from "../sprites/spriteDefs";
import type { SpriteSheets } from "../sprites/spriteSheet";

export function drawEnvironment(
  ctx: CanvasRenderingContext2D,
  world: WorldState,
  sprites: SpriteSheets,
) {
  const rows = world.grid.length;
  const cols = world.grid[0]?.length ?? 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tile: Tile = world.grid[r][c];
      const x = c * TILE_SIZE;
      const y = r * TILE_SIZE;

      // terrain
      if (tile.terrain === "wall") {
        const sheet = sprites.wall;
        drawSpriteCell(ctx, sheet, WALL_BASE, x, y, false);
      } else {
        const sheet = sprites.floor;
        drawSpriteCell(ctx, sheet, FLOOR_BASE, x, y, false);
      }

      // item (simple circle)
      if (tile.item) {
        switch (tile.item.kind) {
          case "item":
            switch (tile.item.type) {
              case "gold":
                drawSpriteCell(ctx, sprites.money, GOLD_BASE, x, y, false);
                break;
              case "food":
                drawSpriteCell(ctx, sprites.food, FOOD_BASE, x, y, false);
                break;
              case "key":
                drawSpriteCell(ctx, sprites.key, KEY_BASE, x, y, false);
                break;
            }
            break;
          case "bundle":
            drawSpriteCell(ctx, sprites.chest0, BUNDLE_BASE, x, y, false);
            break;
        }
      }
    }
  }
}
