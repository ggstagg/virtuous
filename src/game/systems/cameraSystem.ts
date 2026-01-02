import type { WorldState } from "../types/WorldState";
import type { Camera } from "../types/Camera";

export interface CameraParams {
  tileSize: number;
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

// Returns world dimensions in pixels for the currently active grid
function worldPixelSize(world: WorldState, tileSize: number) {
  const rows = world.grid.length;
  const cols = world.grid[0]?.length ?? 0;
  return { worldW: cols * tileSize, worldH: rows * tileSize };
}

function getPlayerDrawPosPx(world: WorldState, tileSize: number) {
  // world-space tile coords
  let drawR = world.player.r;
  let drawC = world.player.c;

  if (world.player.targetR !== null && world.player.targetC !== null) {
    const t =
      world.player.moveDurationMs <= 0
        ? 1
        : Math.min(
            1,
            world.player.moveProgressMs / world.player.moveDurationMs
          );

    drawR =
      world.player.startR + (world.player.targetR - world.player.startR) * t;
    drawC =
      world.player.startC + (world.player.targetC - world.player.startC) * t;
  }

  return {
    // Use center of tile as focus point
    drawX: (drawC + 0.5) * tileSize,
    drawY: (drawR + 0.5) * tileSize,
  };
}

export function createCamera(viewW: number, viewH: number): Camera {
  return {
    x: 0,
    y: 0,
    viewW,
    viewH,
    zoom: 1.4,
    followHalfLifeMs: 150,
  };
}

export function cameraSystem(
  world: WorldState,
  camera: Camera,
  dtMs: number,
  params: CameraParams
) {
  const { tileSize } = params;
  const { worldW, worldH } = worldPixelSize(world, tileSize);

  // Compute player's draw position in world pixels (use interpolation if moving)
  const { drawX, drawY } = getPlayerDrawPosPx(world, tileSize);

  const visibleW = camera.viewW / camera.zoom;
  const visibleH = camera.viewH / camera.zoom;

  // Target camera so player is centered
  const targetX = drawX - camera.viewW / camera.zoom / 2;
  const targetY = drawY - camera.viewH / camera.zoom / 2;

  if (camera.followHalfLifeMs <= 0) {
    camera.x = targetX;
    camera.y = targetY;
  } else {
    const k = Math.log(2) / camera.followHalfLifeMs;
    const t = 1 - Math.exp(-k * dtMs);

    camera.x += (targetX - camera.x) * t;
    camera.y += (targetY - camera.y) * t;
  }

  // Clamp to world bounds
  const maxX = Math.max(0, worldW - visibleW);
  const maxY = Math.max(0, worldH - visibleH);

  camera.x = clamp(camera.x, 0, maxX);
  camera.y = clamp(camera.y, 0, maxY);
}
