import { TILE_SIZE } from "../../constants/viewConstants";

export function drawGameOver(
  ctx: CanvasRenderingContext2D,
  viewW: number,
  viewH: number,
) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = "rgba(0,0,0,0.65)";
  ctx.fillRect(0, 0, viewW * TILE_SIZE, viewH * TILE_SIZE);

  ctx.fillStyle = "white";
  ctx.font = "bold 48px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("GAME OVER", 200, 200);

  ctx.font = "24px sans-serif";
  ctx.fillText("Press R to restart", 200, 260);

  ctx.restore();
}
