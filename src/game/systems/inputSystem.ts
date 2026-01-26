import { DIRECTIONS, type Direction } from "../types/Direction";
import type { PlayerActions } from "../types/Player";

export interface InputState {
  heldDirections: Set<Direction>;
  functionKeys: Set<string>;
  actionPressed: PlayerActions;
}

export function createInputState(): InputState {
  return {
    heldDirections: new Set(),
    functionKeys: new Set(),
    actionPressed: null,
  };
}

export function clearPressed(input: InputState) {
  input.functionKeys.clear();
}

export function consumeAction(input: InputState): PlayerActions {
  const action = input.actionPressed;
  input.actionPressed = null;
  return action;
}

export function attachKeyboard(input: InputState): () => void {
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) return;
    if (e.code === "Space" || e.key.startsWith("Arrow")) e.preventDefault();

    switch (e.code) {
      case "ArrowUp":
      case "KeyW":
        input.heldDirections.add(DIRECTIONS.North);
        break;
      case "ArrowDown":
      case "KeyS":
        input.heldDirections.add(DIRECTIONS.South);
        break;
      case "ArrowLeft":
      case "KeyA":
        input.heldDirections.add(DIRECTIONS.West);
        break;
      case "ArrowRight":
      case "KeyD":
        input.heldDirections.add(DIRECTIONS.East);
        break;

      case "Space":
      case "KeyF":
        input.actionPressed = "attack";
        break;

      case "KeyH":
        input.actionPressed = "heal";
        break;

      default:
        if (!e.repeat) input.functionKeys.add(e.key);
        break;
    }
  };

  const onKeyUp = (e: KeyboardEvent) => {
    switch (e.code) {
      case "ArrowUp":
      case "KeyW":
        input.heldDirections.delete(DIRECTIONS.North);
        break;
      case "ArrowDown":
      case "KeyS":
        input.heldDirections.delete(DIRECTIONS.South);
        break;
      case "ArrowLeft":
      case "KeyA":
        input.heldDirections.delete(DIRECTIONS.West);
        break;
      case "ArrowRight":
      case "KeyD":
        input.heldDirections.delete(DIRECTIONS.East);
        break;
    }
  };

  window.addEventListener("keydown", onKeyDown, { passive: false });
  window.addEventListener("keyup", onKeyUp);

  return () => {
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
  };
}
