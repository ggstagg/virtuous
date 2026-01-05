import { TILE_SIZE } from "../constants/viewConstants";
import type { Tile } from "../types/Tile";
import type { WorldState } from "../types/WorldState";

export function drawTiles(
  ctx: CanvasRenderingContext2D,
  rows: number,
  cols: number,
  world: WorldState
) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tile: Tile = world.grid[r][c];
      const x = c * TILE_SIZE;
      const y = r * TILE_SIZE;

      // terrain
      if (tile.terrain === "wall") {
        ctx.fillStyle = "#2b2b2b";
      } else {
        ctx.fillStyle = "#1a1a1a";
      }
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

      // grid lines
      // ctx.strokeStyle = "rgba(255,255,255,0.06)";
      // ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);

      // item (simple circle)
      if (tile.item) {
        ctx.beginPath();
        switch (tile.item.type) {
          case "gold":
            ctx.fillStyle = "#d7b400";
            break;
          case "food":
            ctx.fillStyle = "#6ad06a";
            break;
          case "key":
            ctx.fillStyle = "#ecececff";
        }
        ctx.arc(
          x + TILE_SIZE / 2,
          y + TILE_SIZE / 2,
          Math.max(3, TILE_SIZE * 0.18),
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }
  }
}
