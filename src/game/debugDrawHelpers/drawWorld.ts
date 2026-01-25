import { drawGameOver } from "./drawGameOver";
import { drawDebugInformation } from "./drawDebugInformation";
import { debugDrawTiles } from "./debugDrawTiles";
import { debugDrawEntities } from "./debugDrawEntities";
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

  if (world.renderMode === "debug") {
    debugDrawTiles(ctx, rows, cols, world);
    debugDrawEntities(ctx, world);
  } else {
    console.log("drawing sprites");
  }

  ctx.restore();

  // drawHealthBar(ctx, world.player.hp, world.player.maxHp, width);

  if (world.gameOver) drawGameOver(ctx, camera.viewW, camera.viewH);
  drawDebugInformation(ctx, world, camera);
}
