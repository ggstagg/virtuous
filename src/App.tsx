import { useEffect, useRef, useState } from "react";
import "./App.css";
import { createInitialWorldState } from "./game/world/createInitialWorldState";
import {
  GameCanvas,
  type GameCanvasHandle,
} from "./game/components/GameCanvas";
import type { WorldState } from "./game/types/WorldState";
import { startLoop } from "./game/systems/gameLoop";

const SIM_TICK_MS = 1000;

function App() {
  const worldRef = useRef<WorldState>(createInitialWorldState());
  const loopHandleRef = useRef<ReturnType<typeof startLoop> | null>(null);
  const loopStartedRef = useRef(false);

  const [canvasHandle, setCanvasHandle] = useState<GameCanvasHandle | null>(
    null
  );

  useEffect(() => {
    if (!canvasHandle) return;
    if (loopHandleRef.current) return;

    loopStartedRef.current = true;

    loopHandleRef.current = startLoop({
      simTickMs: SIM_TICK_MS,
      stepSim: () => {
        worldRef.current.tick += 1;
      },
      render: () => {
        canvasHandle.render();
      },
    });

    return () => {
      loopHandleRef.current?.stop();
      loopHandleRef.current = null;
      loopStartedRef.current = false;
    };
  }, [canvasHandle]);

  return (
    <div className="p-6">
      <GameCanvas worldRef={worldRef} onReady={setCanvasHandle} />
    </div>
  );
}

export default App;
