import type { WorldState } from "../types/WorldState";
import { manhattanDistance } from "./pathfinding/manhattan";

export function healthSystem(world: WorldState, dtMs: number) {
  if (world.gameOver) return;

  const player = world.player;

  player.invulnerabilityMs = Math.max(0, player.invulnerabilityMs - dtMs);

  if (player.hp <= 0) {
    player.hp = 0;
    world.gameOver = true;
    return;
  }

  if (player.invulnerabilityMs > 0) return;

  for (const enemy of Object.values(world.enemies)) {
    const distance = manhattanDistance(enemy.r, enemy.c, player.r, player.c);
    if (distance !== 1) continue;

    const damage = Math.max(1, enemy.attackPower);
    player.hp = Math.max(0, player.hp - damage);
    player.invulnerabilityMs = 400;

    if (player.hp <= 0) {
      world.gameOver = true;
    }
    break;
  }
}
