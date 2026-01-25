import { useEffect, useRef } from "react";
import type { WorldState } from "../types/WorldState";
import type { Camera } from "../types/Camera";
import { drawWorld } from "../render/drawWorld";
import type { SpriteSheets } from "../render/sprites/spriteSheet";

export interface GameCanvasHandle {
  render: (camera: Camera) => void;
}

export function GameCanvas({
  worldRef,
  width,
  height,
  spritesRef,
  onReady,
}: {
  worldRef: React.RefObject<WorldState>;
  width: number;
  height: number;
  spritesRef: React.RefObject<SpriteSheets | null>;
  onReady: (handle: GameCanvasHandle) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;

    // Set the display size
    canvas.style.width = `100%`;
    canvas.style.height = `100%`;

    // Set the actual pixel buffer size
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(devicePixelRatio, devicePixelRatio);

    // Scale so drawing uses CSS pixels
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctxRef.current = ctx;

    onReady({
      render: (camera: Camera) => {
        const ctxNow = ctxRef.current;
        if (!ctxNow) return;
        drawWorld(
          ctxNow,
          worldRef.current,
          spritesRef.current,
          camera,
          dpr,
        );
      },
    });
  }, [onReady, width, height, spritesRef, worldRef]);

  return <canvas ref={canvasRef} style={{ display: "block" }} />;
}
