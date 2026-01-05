export function drawDirectionArrow(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  facing: string
) {
  ctx.fillStyle = "white";
  ctx.beginPath();

  switch (facing) {
    case "north":
      ctx.moveTo(cx, cy - size);
      ctx.lineTo(cx - size * 0.6, cy + size * 0.6);
      ctx.lineTo(cx + size * 0.6, cy + size * 0.6);
      break;

    case "south":
      ctx.moveTo(cx, cy + size);
      ctx.lineTo(cx - size * 0.6, cy - size * 0.6);
      ctx.lineTo(cx + size * 0.6, cy - size * 0.6);
      break;

    case "west":
      ctx.moveTo(cx - size, cy);
      ctx.lineTo(cx + size * 0.6, cy - size * 0.6);
      ctx.lineTo(cx + size * 0.6, cy + size * 0.6);
      break;

    case "east":
      ctx.moveTo(cx + size, cy);
      ctx.lineTo(cx - size * 0.6, cy - size * 0.6);
      ctx.lineTo(cx - size * 0.6, cy + size * 0.6);
      break;
  }

  ctx.closePath();
  ctx.fill();
}