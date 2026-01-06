import { useEffect, useRef } from "react";
import type { WorldState } from "../types/WorldState";
import type { Camera } from "../types/Camera";
import { drawGameOver } from "../drawHelpers/drawGameOver";
import { drawDebug } from "../drawHelpers/drawDebug";
import { drawTiles } from "../drawHelpers/drawTiles";
import { drawEntities } from "../drawHelpers/drawEntities";

function drawWorld(
  ctx: CanvasRenderingContext2D,
  world: WorldState,
  camera: Camera,
  width: number,
  height: number
) {
  // Clear the VIEWPORT (not the world)
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, width, height);

  ctx.save();

  // snap camera to avoid seams
  const snappedX = Math.round(camera.x * camera.zoom) / camera.zoom;
  const snappedY = Math.round(camera.y * camera.zoom) / camera.zoom;

  ctx.scale(camera.zoom, camera.zoom);
  ctx.translate(-snappedX, -snappedY);

  const rows = world.grid.length;
  const cols = world.grid[0]?.length ?? 0;

  drawTiles(ctx, rows, cols, world);
  drawEntities(ctx, world);

  ctx.restore();

  // drawHealthBar(ctx, world.player.hp, world.player.maxHp, width);
  if (world.gameOver) drawGameOver(ctx, camera.viewW, camera.viewH);
  drawDebug(ctx, world, camera);
}

export interface GameCanvasHandle {
  render: (camera: Camera) => void;
}

export function GameCanvas({
  worldRef,
  width,
  height,
  onReady,
}: {
  worldRef: React.MutableRefObject<WorldState>;
  width: number;
  height: number;
  onReady: (handle: GameCanvasHandle) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;

    // Set the display size
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Set the actual pixel buffer size
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(devicePixelRatio, devicePixelRatio);

    // Scale so drawing uses CSS pixels
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctxRef.current = ctx;

    onReady({
      render: (camera: Camera) => {
        const ctxNow = ctxRef.current;
        if (!ctxNow) return;
        drawWorld(ctxNow, worldRef.current, camera, width, height);
      },
    });
  }, [onReady, worldRef, width, height]);

  return (
    <canvas
      ref={canvasRef}
      // prevent touch scrolling on mobile
      style={{ display: "block" }}
    />
  );
}
