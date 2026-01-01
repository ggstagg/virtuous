import { useEffect, useRef, useState } from "react";
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

  ctx.fillStyle = "white";
  ctx.font = "12px sans-serif";
  ctx.fillText(`tick: ${world.tick}`, 6, 14);
}

export interface GameCanvasHandle {
  render: () => void;
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

  const [size, setSize] = useState<{
    widthPx: number;
    heightPx: number;
  } | null>(null);

  useEffect(() => {
    const world = worldRef.current;
    const cols = world.grid[0]?.length ?? 0;
    const rows = world.grid.length;

    setSize({
      widthPx: cols * TILE_SIZE,
      heightPx: rows * TILE_SIZE,
    });
  }, [worldRef]);

  useEffect(() => {
    if (!size) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;

    // Set the display size
    canvas.style.width = `${size.widthPx}px`;
    canvas.style.height = `${size.heightPx}px`;

    // Set the actual pixel buffer size
    canvas.width = Math.floor(size.widthPx * dpr);
    canvas.height = Math.floor(size.heightPx * dpr);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Scale so drawing uses CSS pixels
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctxRef.current = ctx;

    onReady({
      render: () => {
        const ctxNow = ctxRef.current;
        if (!ctxNow) return;
        drawWorld(ctxNow, worldRef.current);
      },
    });

    // Draw once
    drawWorld(ctx, worldRef.current);
  }, [size, onReady, worldRef]);

  return (
    <canvas
      ref={canvasRef}
      // prevent touch scrolling on mobile
      style={{ display: "block" }}
    />
  );
}
