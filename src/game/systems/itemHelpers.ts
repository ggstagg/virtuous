import type { Item } from "../types/Item";
import type { WorldState } from "../types/WorldState";

let itemCounter = 0;

function newItemId(prefix: string) {
  itemCounter += 1;
  return `${prefix}-${itemCounter}`;
}

export function placeItemIfFree(
  world: WorldState,
  r: number,
  c: number,
  item: Item
): boolean {
  const tile = world.grid[r]?.[c];

  if (!tile || !tile.isWalkable || tile.item || tile.entityId) return false;

  tile.item = item;
  return true;
}

export function spawnGold(
  world: WorldState,
  r: number,
  c: number,
  quantity = 1
): boolean {
  const itemId: string = newItemId("gold");
  const item: Item = {
    id: itemId,
    type: "gold",
    quantity,
  };

  return placeItemIfFree(world, r, c, item);
}

export function spawnFood(
  world: WorldState,
  r: number,
  c: number,
  quantity = 1
): boolean {
  const itemId: string = newItemId("food");
  const item: Item = {
    id: itemId,
    type: "food",
    quantity,
  };

  return placeItemIfFree(world, r, c, item);
}

export function spawnKey(
  world: WorldState,
  r: number,
  c: number,
  keyId: string
): boolean {
  const itemId: string = newItemId("key");
  const item: Item = {
    id: itemId,
    type: "key",
    keyId,
  };

  return placeItemIfFree(world, r, c, item);
}
