import { bfsPathfinder } from "../systems/pathfinding/bfs";
import type { SaveState } from "../types/SaveState";
import type { WorldState } from "../types/WorldState";

export function fromSaveState(saveState: SaveState): WorldState {
  const grid = saveState.grid.map((row) =>
    row.map((tile) => ({ ...tile, entityId: null })),
  );

  const enemies: WorldState["enemies"] = {};
  for (const [enemyId, enemy] of Object.entries(saveState.enemies)) {
    enemies[enemyId] = {
      ...enemy,
      pathfinder: bfsPathfinder,
      currentPath: null,
      pathIndex: 0,
      nextDirection: null,
      pathGoalR: null,
      pathGoalC: null,
    };
  }

  const world: WorldState = {
    grid,
    player: saveState.player,
    enemies,
    neutrals: saveState.neutrals,
    tick: saveState.tick,
    seed: saveState.seed,
    uiVersion: 0,
    eventLog: [],
    gameOver: saveState.gameOver,
    renderMode: saveState.renderMode,
  };

  world.grid[world.player.r][world.player.c].entityId = world.player.id;

  for (const enemy of Object.values(world.enemies)) {
    if (enemy.hp <= 0) continue;
    world.grid[enemy.r][enemy.c].entityId = enemy.id;
  }

  for (const neutral of Object.values(world.neutrals)) {
    if (neutral.hp <= 0) continue;
    world.grid[neutral.r][neutral.c].entityId = neutral.id;
  }

  return world;
}
