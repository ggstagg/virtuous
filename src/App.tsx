import { useEffect, useRef, useState } from "react";
import "./App.css";
import { createInitialWorldState } from "./game/world/createInitialWorldState";
import {
  GameCanvas,
  type GameCanvasHandle,
} from "./game/components/GameCanvas";
import type { WorldState } from "./game/types/WorldState";
import { startLoop } from "./game/systems/gameLoop";
import {
  attachKeyboard,
  createInputState,
  type InputState,
} from "./game/systems/inputSystem";
import { stepWorld } from "./game/systems/stepWorld";

const SIM_TICK_MS = 10;

function App() {
  const worldRef = useRef<WorldState>(createInitialWorldState());
  const inputRef = useRef<InputState>(createInputState());

  const loopHandleRef = useRef<ReturnType<typeof startLoop> | null>(null);
  const loopStartedRef = useRef(false);

  const [canvasHandle, setCanvasHandle] = useState<GameCanvasHandle | null>(
    null
  );

  useEffect(() => {
    const detach = attachKeyboard(inputRef.current);
    return detach;
  }, []);

  useEffect(() => {
    if (!canvasHandle) return;
    if (loopHandleRef.current) return;

    loopStartedRef.current = true;

    loopHandleRef.current = startLoop({
      simTickMs: SIM_TICK_MS,
      stepSim: (dtMs) => {
        stepWorld(worldRef.current, inputRef.current, dtMs);
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
