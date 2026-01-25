import { useEffect, useRef } from "react";
import type { WorldState } from "../types/WorldState";
import type { Camera } from "../types/Camera";
import { drawWorld } from "../debugDrawHelpers/drawWorld";

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

  return <canvas ref={canvasRef} style={{ display: "block" }} />;
}
