import { useEffect, useRef } from "react";
import type { WorldState } from "../types/WorldState";
import type { Tile } from "../types/Tile";
import type { Camera } from "../types/Camera";

export const TILE_SIZE = 32;

export const VIEW_W = 1000;
export const VIEW_H = 660;

function drawDirectionArrow(
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

function drawWorld(
  ctx: CanvasRenderingContext2D,
  world: WorldState,
  camera: Camera
) {
  const rows = world.grid.length;
  const cols = world.grid[0]?.length ?? 0;

  // background clear
  ctx.clearRect(0, 0, cols * TILE_SIZE, rows * TILE_SIZE);

  ctx.save();

  ctx.scale(camera.zoom, camera.zoom);
  ctx.translate(-camera.x, -camera.y);

  // tiles
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tile: Tile = world.grid[r][c];
      const x = c * TILE_SIZE;
      const y = r * TILE_SIZE;

      // terrain
      if (tile.terrain === "wall") {
        ctx.fillStyle = "#2b2b2b";
      } else {
        ctx.fillStyle = "#1a1a1a";
      }
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

      // grid lines
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);

      // item (simple circle)
      if (tile.item) {
        ctx.beginPath();
        ctx.fillStyle = tile.item.type === "gold" ? "#d7b400" : "#6ad06a";
        ctx.arc(
          x + TILE_SIZE / 2,
          y + TILE_SIZE / 2,
          Math.max(3, TILE_SIZE * 0.18),
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }
  }

  // player
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

  const px = drawC * TILE_SIZE;
  const py = drawR * TILE_SIZE;

  ctx.fillStyle = "#4aa3ff";
  ctx.fillRect(px + 3, py + 3, TILE_SIZE - 6, TILE_SIZE - 6);

  // arrow to indicate direction of travel
  const centerX = px + TILE_SIZE / 2;
  const centerY = py + TILE_SIZE / 2;

  drawDirectionArrow(
    ctx,
    centerX,
    centerY,
    TILE_SIZE * 0.25,
    world.player.facing
  );

  ctx.restore();

  ctx.fillStyle = "white";
  ctx.font = "12px sans-serif";
  ctx.fillText(`tick: ${world.tick}`, 6, 14);
  ctx.fillText(`zoom: ${camera.zoom.toFixed(2)}`, 6, 28);
}

export interface GameCanvasHandle {
  render: (camera: Camera) => void;
}

export function GameCanvas({
  worldRef,
  onReady,
}: {
  worldRef: React.MutableRefObject<WorldState>;
  onReady: (handle: GameCanvasHandle) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;

    // Set the display size
    canvas.style.width = `${VIEW_W}px`;
    canvas.style.height = `${VIEW_H}px`;

    // Set the actual pixel buffer size
    canvas.width = Math.floor(VIEW_W * dpr);
    canvas.height = Math.floor(VIEW_H * dpr);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Scale so drawing uses CSS pixels
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctxRef.current = ctx;

    onReady({
      render: (camera: Camera) => {
        const ctxNow = ctxRef.current;
        if (!ctxNow) return;
        drawWorld(ctxNow, worldRef.current, camera);
      },
    });
  }, [onReady, worldRef]);

  return (
    <canvas
      ref={canvasRef}
      // prevent touch scrolling on mobile
      style={{ display: "block" }}
    />
  );
}
