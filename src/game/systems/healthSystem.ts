import type { WorldState } from "../types/WorldState";

export function healthSystem(world: WorldState, dtMs: number) {
  if (world.gameOver) return;

  const player = world.player;

  for (const entity of [
    player,
    ...Object.values(world.neutrals),
    ...Object.values(world.enemies),
  ]) {
    entity.invulnerabilityMs = Math.max(0, entity.invulnerabilityMs - dtMs);
  }

}
