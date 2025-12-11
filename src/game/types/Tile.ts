import type { Item } from "./Item";

export type TerrainType = "floor" | "wall";

export interface Tile {
  terrain: TerrainType;
  isWalkable: boolean;
  item: Item | null;
  entityId: string | null;
  portalId?: string | null;
}
 