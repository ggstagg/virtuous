import type { Bundle } from "../../types/Bundle";
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
        `${player.id} picked up ${item.name ?? "nameless key"}.`,
      );
      return;
    }
    case "weapon": {
      player.inventory.push(item);
      pushEvent(
        world,
        "good",
        `${player.id} picked up ${item.name ?? "nameless weapon"}.`,
      );
      return;
    }
  }
}

function giveBundleToPlayer(world: WorldState, bundle: Bundle) {
  const player = world.player;

  if (bundle.gold) {
    player.gold += bundle.gold;
    pushEvent(world, "good", `${player.id} looted ${bundle.gold} gold.`);
  }
  if (bundle.food) {
    player.food += bundle.food;
    pushEvent(world, "good", `${player.id} looted ${bundle.food} food.`);
  }
  for (const item of bundle.items) giveItemToPlayer(world, item);
}

export function itemPickupSystem(world: WorldState) {
  const player = world.player;
  const playerTile = world.grid[player.r][player.c];

  if (!playerTile || !playerTile.item) return;

  const loot = playerTile.item;

  switch (loot.kind) {
    case "bundle":
      giveBundleToPlayer(world, loot);
      break;
    case "item":
      giveItemToPlayer(world, loot);
      break;
  }
  playerTile.item = null;
}
