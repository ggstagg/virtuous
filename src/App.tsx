import { useEffect, useRef, useState } from "react";
import "./App.css";
import { createInitialWorldState } from "./game/world/createInitialWorldState";
import {
  GameCanvas,
  TILE_SIZE,
  VIEW_H,
  VIEW_W,
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
import { type Camera } from "./game/types/Camera";
import { cameraSystem, createCamera } from "./game/systems/cameraSystem";

const SIM_TICK_MS = 10;

function App() {
  const worldRef = useRef<WorldState>(createInitialWorldState());
  const inputRef = useRef<InputState>(createInputState());

  const cameraRef = useRef<Camera>(createCamera(VIEW_W, VIEW_H));

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
        cameraSystem(worldRef.current, cameraRef.current, dtMs, {
          tileSize: TILE_SIZE,
        });
      },
      render: () => {
        canvasHandle.render(cameraRef.current);
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
