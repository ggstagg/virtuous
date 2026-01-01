import type { Grid } from "../types/Grid";
import type { Item } from "../types/Item";
import type { TerrainType, Tile } from "../types/Tile";

export const OVERWORLD_SECTION_1_ROWS = 30;
export const OVERWORLD_SECTION_1_COLS = 30;

function makeTile(terrain: TerrainType): Tile {
  return {
    terrain,
    isWalkable: terrain === "floor",
    item: null,
    entityId: null,
    portalId: null,
  };
}

function placeWall(grid: Grid, r: number, c: number) {
  if (r > -1 && c > -1 && r < grid.length && c < grid[0].length) {
    grid[r][c] = makeTile("wall");
  }
}

function placeItem(grid: Grid, r: number, c: number, item: Item) {
  if (r > -1 && c > -1 && r < grid.length && c < grid[0].length) {
    if (grid[r][c].isWalkable) grid[r][c].item = item;
  }
}

let itemCounter = 0;
function newItem(type: Item["type"], quantity: number): Item {
  itemCounter++;
  return {
    id: `item-${itemCounter}`,
    type,
    quantity,
  };
}

export function createOverworldSection1(): Tile[][] {
  const grid: Grid = Array.from({ length: OVERWORLD_SECTION_1_ROWS }, () =>
    Array.from({ length: OVERWORLD_SECTION_1_COLS }, () => makeTile("floor"))
  );

  // outer walls
  for (let i = 0; i < OVERWORLD_SECTION_1_ROWS; i++) {
    placeWall(grid, i, 0);
    placeWall(grid, i, OVERWORLD_SECTION_1_COLS - 1);
  }

  for (let i = 0; i < OVERWORLD_SECTION_1_COLS; i++) {
    placeWall(grid, 0, i);
    placeWall(grid, OVERWORLD_SECTION_1_ROWS - 1, i);
  }

  for (let r = 1; r < OVERWORLD_SECTION_1_ROWS - 1; r++)
    if (r !== 20) placeWall(grid, r, 9);

  for (let c = 1; c < OVERWORLD_SECTION_1_COLS - 1; c++) {
    if (c === 5 || c === 24) continue;
    placeWall(grid, 8, c);
  }

  // inner room
  const top = 16,
    left = 16,
    bottom = 24,
    right = 24;

  for (let c = left; c <= right; c++) {
    placeWall(grid, top, c);
    placeWall(grid, bottom, c);
  }
  for (let r = top; r <= bottom; r++) {
    placeWall(grid, r, left);
    placeWall(grid, r, right);
  }

  grid[top][Math.floor((left + right) / 2)] = makeTile("floor");

  // items on floor
  placeItem(grid, 10, 12, newItem("gold", 10));
  placeItem(grid, 10, 16, newItem("gold", 15));
  placeItem(grid, 19, 9, newItem("food", 1));
  placeItem(grid, 22, 22, newItem("gold", 25));
  placeItem(grid, 25, 6, newItem("food", 2));

  return grid;
}
