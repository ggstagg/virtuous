import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createInitialWorldState } from "./game/world/createInitialWorldState";
import {
  GameCanvas,
  type GameCanvasHandle,
} from "./game/components/GameCanvas";
import type { WorldState } from "./game/types/WorldState";
import { startLoop } from "./game/systems/gameLoop";
import {
  attachKeyboard,
  clearPressed,
  createInputState,
  type InputState,
} from "./game/systems/inputSystem";
import { stepWorld } from "./game/systems/stepWorld";
import { type Camera } from "./game/types/Camera";
import { cameraSystem, createCamera } from "./game/systems/cameraSystem";
import { TILE_SIZE } from "./game/constants/viewConstants";
import { computeLayout } from "./computeViewSize";
import { GameHUD } from "./game/components/GameHUD";
import {
  hasSave,
  loadFromLocalStorage,
  saveToLocalStorage,
} from "./game/save/localStorage";
import { pushEvent } from "./game/systems/eventLog";
import StartMenu from "./game/components/StartMenu";

const SIM_TICK_MS = 10;

function App() {
  const [uiVersion, setUIVersion] = useState(0);

  const [layout, setLayout] = useState(() => computeLayout());

  const worldRef = useRef<WorldState>(createInitialWorldState());
  const inputRef = useRef<InputState>(createInputState());
  const [mode, setMode] = useState<"menu" | "game">("menu");

  const cameraRef = useRef<Camera>(createCamera(layout.viewW, layout.viewH));

  const loopHandleRef = useRef<ReturnType<typeof startLoop> | null>(null);
  const loopStartedRef = useRef(false);

  const [canvasHandle, setCanvasHandle] = useState<GameCanvasHandle | null>(
    null,
  );
  const canContinue = useMemo(() => hasSave(), [uiVersion]);

  const saveNow = useCallback(() => {
    console.log("saving to local storage");
    saveToLocalStorage(worldRef.current);
    pushEvent(worldRef.current, "info", "Game saved.");
    setUIVersion((v) => v + 1);
  }, []);

  const loadNow = useCallback(() => {
    console.log("laoding from local storage");
    const loaded = loadFromLocalStorage();
    if (!loaded) {
      pushEvent(worldRef.current, "info", "No save found.");
      setUIVersion((v) => v + 1);
      return;
    }

    worldRef.current = loaded;
    pushEvent(worldRef.current, "info", "Game loaded.");
    setUIVersion((v) => v + 1);
  }, []);

  const resetGame = useCallback(() => {
    worldRef.current = createInitialWorldState();
    cameraRef.current = createCamera(layout.viewW, layout.viewH);
  }, [layout]);

  useEffect(() => {
    const detach = attachKeyboard(inputRef.current);
    return detach;
  }, []);

  useEffect(() => {
    if (mode !== "game") return;
    if (!canvasHandle) return;
    if (loopHandleRef.current) return;

    loopStartedRef.current = true;

    loopHandleRef.current = startLoop({
      simTickMs: SIM_TICK_MS,
      stepSim: (dtMs) => {
        stepWorld(worldRef.current, inputRef.current, dtMs);
        cameraSystem(worldRef.current, cameraRef.current, dtMs, {
          tileSize: TILE_SIZE,
          input: inputRef.current,
        });
        clearPressed(inputRef.current);
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
  }, [canvasHandle, mode]);

  useEffect(() => {
    const onResize = () => setLayout(computeLayout());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (key === "r") resetGame();

      if ((e.ctrlKey || e.metaKey) && key === "s") {
        e.preventDefault();
        saveNow();
      }

      if ((e.ctrlKey || e.metaKey) && key === "l") {
        e.preventDefault();
        loadNow();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [resetGame, saveNow, loadNow]);

  const startGame = useCallback(() => {
    worldRef.current = createInitialWorldState();
    pushEvent(worldRef.current, "info", "New game started.");
    setUIVersion((v) => v + 1);
    setMode("game");
  }, []);

  const continueGame = useCallback(() => {
    const loaded = loadFromLocalStorage();
    if (!loaded) {
      setUIVersion((v) => v + 1);
      return;
    }

    loadNow();
    setMode("game");
  }, []);

  return (
    <div
      className="w-screen min-h-dvh overflow-hidden"
      style={{
        backgroundImage: `url(/dungeon-background-1.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/15 to-black/85" />
      <div className="relative z-10 h-dvh w-screen flex items-center justify-center p-6">
        <div
          className="h-dvh w-screen flex items-center justify-center"
          style={{ padding: layout.framePad }}
        >
          {mode === "menu" && (
            <StartMenu
              canContinue={canContinue}
              onContinue={continueGame}
              onStart={startGame}
            />
          )}
          <div
            className="bg-zinc-950 rounded-xl shadow-2xl"
            style={{ padding: layout.framePad }}
          >
            <div className="flex" style={{ gap: layout.gap }}>
              {/* Canvas */}
              <div className="bg-black rounded-lg overflow-hidden">
                {/* TODO: need to figure out how to update camera based on view availability */}
                <GameCanvas
                  worldRef={worldRef}
                  width={layout.viewW}
                  height={layout.viewH}
                  onReady={setCanvasHandle}
                />
              </div>

              {/* Sidebar */}
              <GameHUD
                worldRef={worldRef}
                sidebarW={layout.sidebarW}
                viewH={layout.viewH}
                uiVersion={uiVersion}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
