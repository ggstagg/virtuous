import { TILE_SIZE } from "../../constants/viewConstants";
import { DirectionDelta, DIRECTIONS } from "../../types/Direction";
import type { WorldState } from "../../types/WorldState";

export function drawAttackVfx(
  ctx: CanvasRenderingContext2D,
  world: WorldState,
) {
  for (const vfx of world.attackVfx) {
    const t = vfx.ageMs / vfx.ttlMs;
    const alpha = 1 - t;

    const d = DirectionDelta[vfx.direction];
    const targetR = vfx.r + d.dr;
    const targetC = vfx.c + d.dc;

    const cx = (targetC + 0.5) * TILE_SIZE;
    const cy = (targetR + 0.5) * TILE_SIZE;

    // length scales down over time
    const len = TILE_SIZE * (0.9 - 0.2 * t);
    const thick = Math.max(2, TILE_SIZE * 0.08);

    // pick line direction: horizontal for E/W, vertical for N/S
    const horizontal =
      vfx.direction === DIRECTIONS.East || vfx.direction === DIRECTIONS.West;

    ctx.save();
    ctx.globalAlpha = alpha;

    // direction basis for the slash
    const nx = horizontal ? 1 : 1; // along-slash x component (normalized-ish)
    const ny = horizontal ? 0.55 : -0.55; // along-slash y component
    const nLen = Math.hypot(nx, ny);
    const ux = nx / nLen;
    const uy = ny / nLen;

    const px = -uy;
    const py = ux;

    // endpoints
    const x1 = cx - ux * len * 0.5;
    const y1 = cy - uy * len * 0.5;
    const x2 = cx + ux * len * 0.5;
    const y2 = cy + uy * len * 0.5;

    // wide at start, narrow at end
    const w1 = thick * 1.15;
    const w2 = thick * 0.15;

    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.beginPath();
    ctx.moveTo(x1 + px * w1, y1 + py * w1);
    ctx.lineTo(x2 + px * w2, y2 + py * w2);
    ctx.lineTo(x2 - px * w2, y2 - py * w2);
    ctx.lineTo(x1 - px * w1, y1 - py * w1);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = alpha * 0.7;
    ctx.strokeStyle = "rgba(255,60,60,0.85)";
    ctx.lineWidth = thick * 0.55;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.restore();
  }
}
