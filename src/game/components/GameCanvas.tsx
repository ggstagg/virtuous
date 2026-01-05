import { useEffect, useRef } from "react";
import type { WorldState } from "../types/WorldState";
import type { Camera } from "../types/Camera";
import { drawHealthBar } from "../drawHelpers/drawHealthBar";
import { drawGameOver } from "../drawHelpers/drawGameOver";
import { drawDebug } from "../drawHelpers/drawDebug";
import { TILE_SIZE, VIEW_H, VIEW_W } from "../constants/viewConstants";
import { drawTiles } from "../drawHelpers/drawTiles";
import { drawEntities } from "../drawHelpers/drawEntities";

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

  drawTiles(ctx, rows, cols, world);
  drawEntities(ctx, world);

  ctx.restore();

  drawHealthBar(ctx, world.player.hp, world.player.maxHp);

  if (world.gameOver) drawGameOver(ctx, camera.viewW, camera.viewH);

  drawDebug(ctx, world, camera);
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
