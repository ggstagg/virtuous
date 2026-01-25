import { drawGameOver } from "./debugDrawHelpers/drawGameOver";
import { drawDebugInformation } from "./debugDrawHelpers/drawDebugInformation";
import { debugDrawTiles } from "./debugDrawHelpers/debugDrawTiles";
import { debugDrawEntities } from "./debugDrawHelpers/debugDrawEntities";
import type { WorldState } from "../types/WorldState";
import type { Camera } from "../types/Camera";
import type { SpriteSheets } from "./sprites/spriteSheet";
import { drawEntities } from "./drawHelpers/drawEntities";
import { TILE_SIZE } from "../constants/viewConstants";
import { drawEnvironment } from "./drawHelpers/drawEnvironment";

export function drawWorld(
  ctx: CanvasRenderingContext2D,
  world: WorldState,
  sprites: SpriteSheets | null,
  camera: Camera,
  dpr: number,
) {
  const rows = world.grid.length;
  const cols = world.grid[0]?.length ?? 0;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cols * TILE_SIZE, rows * TILE_SIZE);

  ctx.scale(camera.zoom, camera.zoom);
  ctx.translate(-camera.x, -camera.y);

  ctx.save();

  if (world.renderMode === "debug" || sprites === null) {
    debugDrawTiles(ctx, rows, cols, world);
    debugDrawEntities(ctx, world);
    drawDebugInformation(ctx, world, camera);
  } else {
    drawEnvironment(ctx, world, sprites);
    drawEntities(ctx, world, sprites);
  }

  ctx.restore();

  if (world.gameOver) drawGameOver(ctx, camera.viewW, camera.viewH);
}
