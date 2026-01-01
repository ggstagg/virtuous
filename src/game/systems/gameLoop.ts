export type StepSim = (dtMs: number) => void;
export type RenderFrame = () => void;

export interface LoopHandle {
  stop: () => void;
}

export interface StartLoopOptions {
  simTickMs: number;
  stepSim: StepSim;
  render: RenderFrame;
}

export function startLoop(opts: StartLoopOptions): LoopHandle {
  const { simTickMs, stepSim, render } = opts;

  let rafId = 0;
  let running = true;

  let lastTime = performance.now();
  let accumulator = 0;

  const frame = (now: number) => {
    if (!running) return;

    const dt = now - lastTime;
    lastTime = now;

    const clampedDt = Math.min(dt, 250);
    accumulator += clampedDt;

    while (accumulator >= simTickMs) {
      stepSim(simTickMs);
      accumulator -= simTickMs;
    }

    render();
    rafId = requestAnimationFrame(frame);
  };

  rafId = requestAnimationFrame(frame);

  return {
    stop: () => {
      running = false;
      cancelAnimationFrame(rafId);
    },
  };
}
