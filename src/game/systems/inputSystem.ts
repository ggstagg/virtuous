import { DIRECTIONS, type Direction } from "../types/Direction";

export interface InputState {
  heldDirections: Set<Direction>;
  functionKeys: Set<string>;
}

export function createInputState(): InputState {
  return { heldDirections: new Set(), functionKeys: new Set() };
}

const inputKeys: Set<string> = new Set([
  "w",
  "a",
  "s",
  "d",
  "W",
  "A",
  "S",
  "D",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
]);

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

export function clearPressed(input: InputState) {
  input.functionKeys.clear();
}

export function attachKeyboard(input: InputState): () => void {
  const onKeyDown = (e: KeyboardEvent) => {
    if (!e.repeat && !inputKeys.has(e.key)) input.functionKeys.add(e.key);

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
