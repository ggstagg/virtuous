import type { Item } from "../../types/Item";
import type { WorldState } from "../../types/WorldState";
import { pushEvent } from ".././eventLog";

function giveItemToPlayer(world: WorldState, item: Item) {
  const player = world.player;

  switch (item.type) {
    case "gold": {
      const quantity = item.quantity ?? 1;
      player.gold += quantity;
      pushEvent(world, "good", `${player.id} picked up ${quantity} gold.`);
      return;
    }
    case "food": {
      const quantity = item.quantity ?? 1;
      player.food += quantity;
      pushEvent(world, "good", `${player.id} picked up ${quantity} food.`);
      return;
    }
    case "key": {
      player.inventory.push(item);
      pushEvent(
        world,
        "good",
        `${player.id} picked up ${item.name ?? "nameless key"}.`
      );
      return;
    }
    case "weapon": {
      player.inventory.push(item);
      pushEvent(
        world,
        "good",
        `${player.id} picked up ${item.name ?? "nameless weapon"}.`
      );
      return;
    }
  }
}

export function itemPickupSystem(world: WorldState) {
  const player = world.player;
  const playerTile = world.grid[player.r][player.c];

  if (!playerTile || !playerTile.item) return;

  giveItemToPlayer(world, playerTile.item);
  playerTile.item = null;
}
