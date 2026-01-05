import { TILE_SIZE } from "../constants/viewConstants";
import type { Enemy } from "../types/Enemy";
import type { WorldState } from "../types/WorldState";

export function drawEnemyVision(
  ctx: CanvasRenderingContext2D,
  world: WorldState,
  enemy: Enemy
) {
  const R = enemy.visionRadius;

  ctx.save();
  ctx.fillStyle = "rgba(255,255,0,0.12)";

  for (let rr = enemy.r - R; rr <= enemy.r + R; rr++) {
    for (let cc = enemy.c - R; cc <= enemy.c + R; cc++) {
      if (
        rr < 0 ||
        cc < 0 ||
        rr >= world.grid.length ||
        cc >= (world.grid[0]?.length ?? 0)
      )
        continue;
      const d = Math.abs(rr - enemy.r) + Math.abs(cc - enemy.c);
      if (d > R) continue;

      ctx.fillRect(cc * TILE_SIZE, rr * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  }

  ctx.restore();
}
