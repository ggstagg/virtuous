export function drawGameOver(
  ctx: CanvasRenderingContext2D,
  viewW: number,
  viewH: number
) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = "rgba(0,0,0,0.65)";
  ctx.fillRect(0, 0, viewW, viewH);

  ctx.fillStyle = "white";
  ctx.font = "bold 36px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("GAME OVER", viewW / 2, viewH / 2 - 20);

  ctx.font = "16px sans-serif";
  ctx.fillText("Press R to restart", viewW / 2, viewH / 2 + 20);

  ctx.restore();
}
