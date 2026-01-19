import type { Grid } from "../types/Grid";
import type { TerrainType, Tile } from "../types/Tile";

export const OVERWORLD_SECTION_1_ROWS = 50;
export const OVERWORLD_SECTION_1_COLS = 50;

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

export function createOverworldSection1Layout(): Tile[][] {
  const grid: Grid = Array.from({ length: OVERWORLD_SECTION_1_ROWS }, () =>
    Array.from({ length: OVERWORLD_SECTION_1_COLS }, () => makeTile("floor")),
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
    if (r !== 20 && r !== 4) placeWall(grid, r, 9);

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

  return grid;
}
