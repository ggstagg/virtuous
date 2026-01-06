import type { GameEvent, GameEventType } from "../types/GameEvent";
import type { WorldState } from "../types/WorldState";

const MAX_EVENTS = 20;

export function pushEvent(
  world: WorldState,
  type: GameEventType,
  text: string
) {
  const e: GameEvent = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    tMs: Date.now(),
    type,
    text,
  };

  world.eventLog.push(e);
  if (world.eventLog.length > MAX_EVENTS) {
    world.eventLog.splice(0, world.eventLog.length - MAX_EVENTS);
  }
}
