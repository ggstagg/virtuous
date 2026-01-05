import type { Camera } from "../types/Camera";
import type { WorldState } from "../types/WorldState";

export function drawDebug(
  ctx: CanvasRenderingContext2D,
  world: WorldState,
  camera: Camera
) {
  ctx.fillStyle = "white";
  ctx.font = "12px sans-serif";
  ctx.fillText(`tick: ${world.tick}`, 6, 14);
  ctx.fillText(`zoom: ${camera.zoom.toFixed(2)}`, 6, 28);
  ctx.fillText(`gold: ${world.player.gold}`, 6, 42);
  ctx.fillText(`food: ${world.player.food}`, 6, 56);
  ctx.fillText(`inventory size: ${world.player.inventory.length}`, 6, 70);
  ctx.fillText(`zoom: ${camera.zoom}`, 6, 84);
}
