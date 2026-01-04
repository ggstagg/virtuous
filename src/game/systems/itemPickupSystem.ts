import type { Item } from "../types/Item";
import type { WorldState } from "../types/WorldState";

function giveItemToPlayer(world: WorldState, item: Item) {
  const player = world.player;

  switch (item.type) {
    case "gold": {
      const quantity = item.quantity ?? 1;
      player.gold += quantity;
      return;
    }
    case "food": {
      const quantity = item.quantity ?? 1;
      player.food += quantity;
      return;
    }
    case "key": {
      player.inventory.push(item);
      return;
    }
    case "weapon": {
      player.inventory.push(item);
      return;
    }
  }
}

export function itemPickupSystem(world: WorldState) {
  const player = world.player;
  const playerTile = world.grid[player.r][player.c];

  if (!playerTile || !playerTile.item) return;

  giveItemToPlayer(world, playerTile.item);
  console.log("Player picked up ", playerTile.item.id);
  playerTile.item = null;
}
