import { DIRECTIONS, type Direction } from "../types/Direction";

export interface InputState {
  heldDirections: Set<Direction>;
}

export function createInputState(): InputState {
  return { heldDirections: new Set() };
}

function keyToDirection(key: string): Direction | null {
  switch (key) {
    case "w":
    case "W":
    case "ArrowUp":
      return DIRECTIONS.North;
    case "a":
    case "A":
    case "ArrowLeft":
      return DIRECTIONS.West;
    case "s":
    case "S":
    case "ArrowDown":
      return DIRECTIONS.South;
    case "d":
    case "D":
    case "ArrowRight":
      return DIRECTIONS.East;
    default:
      return null;
  }
}

export function attachKeyboard(input: InputState): () => void {
  const onKeyDown = (e: KeyboardEvent) => {
    const direction = keyToDirection(e.key);
    if (!direction) return;

    if (e.key.startsWith("Arrow")) e.preventDefault();

    input.heldDirections.delete(direction);
    input.heldDirections.add(direction);
  };

  const onKeyUp = (e: KeyboardEvent) => {
    const direction = keyToDirection(e.key);
    if (!direction) return;

    input.heldDirections.delete(direction);
  };

  window.addEventListener("keydown", onKeyDown, { passive: false });
  window.addEventListener("keyup", onKeyUp);

  return () => {
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
  };
}
