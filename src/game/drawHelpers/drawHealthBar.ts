import { VIEW_W } from "../constants/viewConstants";

export function drawHealthBar(
  ctx: CanvasRenderingContext2D,
  hp: number,
  maxHp: number
) {
  const x = VIEW_W - 200,
    y = 12,
    w = 180,
    h = 16;
  const t = maxHp <= 0 ? 0 : Math.max(0, Math.min(1, hp / maxHp));

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0); // screen space
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(x - 2, y - 2, w + 4, h + 4);

  ctx.fillStyle = "rgba(180,0,0,0.9)";
  ctx.fillRect(x, y, w, h);

  ctx.fillStyle = "rgba(0,200,0,0.9)";
  ctx.fillRect(x, y, w * t, h);

  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.strokeRect(x, y, w, h);
  ctx.restore();
}