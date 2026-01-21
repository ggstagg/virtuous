import type { SaveState } from "../types/SaveState";
import type { WorldState } from "../types/WorldState";

export function toSaveState(world: WorldState): SaveState {
  const grid = world.grid.map((row) =>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    row.map(({ entityId, ...rest }) => rest),
  );

  const enemies: SaveState["enemies"] = {};

  for (const [id, enemy] of Object.entries(world.enemies)) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { pathfinder, currentPath, pathIndex, nextDirection, ...rest } =
      enemy;
    enemies[id] = rest;
  }

  return {
    savedAt: Date.now(),
    seed: world.seed,
    tick: world.tick,
    gameOver: world.gameOver,
    player: world.player,
    enemies,
    neutrals: world.neutrals,
    grid,
  };
}
