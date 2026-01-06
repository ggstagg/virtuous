import type { WorldState } from "../types/WorldState";

export function healthSystem(world: WorldState, dtMs: number) {
  if (world.gameOver) return;

  const player = world.player;

  player.invulnerabilityMs = Math.max(0, player.invulnerabilityMs - dtMs);

  if (player.hp <= 0) {
    player.hp = 0;
    world.gameOver = true;
    return;
  }
}
