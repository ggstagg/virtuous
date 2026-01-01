import { useMemo } from "react";
import "./App.css";
import { createInitialWorldState } from "./game/world/createInitialWorldState";
import { GameCanvas } from "./game/components/GameCanvas";

function App() {
  const world = useMemo(() => createInitialWorldState(), []);

  return (
    <div className="p-6">
      <GameCanvas world={world} />
    </div>
  );
}

export default App;
