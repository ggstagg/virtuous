import type { Bundle } from "./Bundle";
import type { Item } from "./Item";

export type TerrainType = "floor" | "wall";
export type TileLoot = Item | Bundle;

export interface Tile {
  terrain: TerrainType;
  isWalkable: boolean;
  item: TileLoot | null;
  entityId: string | null;
  portalId?: string | null;
}
 