import { useEffect, useMemo, useRef } from "react";
import type { WorldState } from "../types/WorldState";
import type { Tile } from "../types/Tile";

const TILE_SIZE = 32;

function drawWorld(ctx: CanvasRenderingContext2D, world: WorldState) {
  const rows = world.grid.length;
  const cols = world.grid[0]?.length ?? 0;

  // background clear
  ctx.clearRect(0, 0, cols * TILE_SIZE, rows * TILE_SIZE);

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
  const px = world.player.c * TILE_SIZE;
  const py = world.player.r * TILE_SIZE;
  ctx.fillStyle = "#4aa3ff";
  ctx.fillRect(px + 3, py + 3, TILE_SIZE - 6, TILE_SIZE - 6);
}

export function GameCanvas({ world }: { world: WorldState }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const widthPx = useMemo(() => {
    const cols = world.grid[0]?.length ?? 0;
    return cols * TILE_SIZE;
  }, [world.grid]);

  const heightPx = useMemo(() => {
    const rows = world.grid.length;
    return rows * TILE_SIZE;
  }, [world.grid]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;

    // Set the display size
    canvas.style.width = `${widthPx}px`;
    canvas.style.height = `${heightPx}px`;

    // Set the actual pixel buffer size
    canvas.width = Math.floor(widthPx * dpr);
    canvas.height = Math.floor(heightPx * dpr);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Scale so drawing uses CSS pixels
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Draw once
    drawWorld(ctx, world);
  }, [world, widthPx, heightPx]);

  return (
    <canvas
      ref={canvasRef}
      // prevent touch scrolling on mobile
      style={{ display: "block" }}
    />
  );
}
