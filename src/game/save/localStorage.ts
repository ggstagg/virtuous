import { SAVE_KEY } from "../constants/saveConstants";
import type { SaveState } from "../types/SaveState";
import type { WorldState } from "../types/WorldState";
import { fromSaveState } from "./fromSaveState";
import { toSaveState } from "./toSaveState";

export function saveToLocalStorage(world: WorldState) {
  const saveState: SaveState = toSaveState(world);
  localStorage.setItem(SAVE_KEY, JSON.stringify(saveState));
}

export function loadFromLocalStorage(): WorldState | null {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;
  const parsed = JSON.parse(raw) as SaveState;
  if (!parsed) return null;

  return fromSaveState(parsed);
}

export function hasSave(): boolean {
  return localStorage.getItem(SAVE_KEY) !== null;
}

export function clearSave() {
  localStorage.removeItem(SAVE_KEY);
}
