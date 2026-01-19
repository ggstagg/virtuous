import { drawGameOver } from "../drawHelpers/drawGameOver";
import { drawDebug } from "../drawHelpers/drawDebug";
import { drawTiles } from "../drawHelpers/drawTiles";
import { drawEntities } from "../drawHelpers/drawEntities";
import type { WorldState } from "../types/WorldState";
import type { Camera } from "../types/Camera";

export function drawWorld(
  ctx: CanvasRenderingContext2D,
  world: WorldState,
  camera: Camera,
  width: number,
  height: number,
) {
  // Clear the VIEWPORT (not the world)
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, width, height);

  ctx.save();

  // snap camera to avoid seams
  const snappedX = Math.round(camera.x * camera.zoom) / camera.zoom;
  const snappedY = Math.round(camera.y * camera.zoom) / camera.zoom;

  ctx.scale(camera.zoom, camera.zoom);
  ctx.translate(-snappedX, -snappedY);

  const rows = world.grid.length;
  const cols = world.grid[0]?.length ?? 0;

  drawTiles(ctx, rows, cols, world);
  drawEntities(ctx, world);

  ctx.restore();

  // drawHealthBar(ctx, world.player.hp, world.player.maxHp, width);
  
  if (world.gameOver) drawGameOver(ctx, camera.viewW, camera.viewH);
  drawDebug(ctx, world, camera);
}
