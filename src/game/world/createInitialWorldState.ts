// import { spawnGold } from "../systems/itemHelpers";
import { spawnFood, spawnGold, spawnKey } from "../systems/itemHelpers";
import type { WorldState } from "../types/WorldState";
import { createOverworldSection1Layout } from "./createOverworldSection1";
import { createDefaultPlayer } from "./createPlayer";

export function createInitialWorldState(): WorldState {
  const player = createDefaultPlayer();
  const grid = createOverworldSection1Layout();

  // mark player on the grid
  if (grid[player.r]?.[player.c]) {
    grid[player.r][player.c].entityId = player.id;
  }

  const seed = 12345;

  const initialWorldState: WorldState = {
    grid,

    player,

    enemies: {},
    neutrals: {},

    tick: 0,
    seed,
  };

  // items on floor
  spawnGold(initialWorldState, 10, 12, 10);
  spawnGold(initialWorldState, 4, 25, 15);
  spawnFood(initialWorldState, 19, 9, 1);
  spawnGold(initialWorldState, 22, 22, 25);
  spawnFood(initialWorldState, 25, 6, 2);
  spawnKey(initialWorldState, 4, 5, "key-1");

  return initialWorldState;
}
