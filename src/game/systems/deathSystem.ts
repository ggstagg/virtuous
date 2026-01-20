import type { Bundle } from "../types/Bundle";
import type { EntityBase } from "../types/EntityBase";
import type { Tile } from "../types/Tile";
import type { WorldState } from "../types/WorldState";
import { pushEvent } from "./eventLog";
import { inBounds } from "./movementHelpers";

function makebundle(entity: EntityBase): Bundle {
  return {
    kind: "bundle",
    gold: entity.gold,
    food: entity.food,
    items: [...entity.inventory],
  };
}

function dropLoot(world: WorldState, r: number, c: number, loot: Bundle) {
  const candidateCells = [
    { r, c },
    { r: r - 1, c },
    { r: r + 1, c },
    { r, c: c - 1 },
    { r, c: c + 1 },
  ];

  for (const cell of candidateCells) {
    if (!inBounds(world, cell.r, cell.c)) continue;
    const tile: Tile = world.grid[cell.r][cell.c];
    if (!tile.isWalkable) continue;
    if (tile.item !== null) continue;
    tile.item = loot;
    return true;
  }
  return false;
}

function handleDeath(
  world: WorldState,
  entity: EntityBase,
  entityType: "enemy" | "neutral",
) {
  const hasLoot =
    entity.gold > 0 || entity.food > 0 || entity.inventory.length > 0;

  if (hasLoot) {
    const bundle = makebundle(entity);
    const dropped = dropLoot(world, entity.r, entity.c, bundle);

    if (dropped) {
      pushEvent(world, "info", `${entity.id} dropped loot.`);
    } else {
      pushEvent(
        world,
        "info",
        `${entity.id} died, but loot had nowhere to drop.`,
      );
    }
  }

  if (entityType === "enemy") {
    delete world.enemies[entity.id];
  }
  if (entityType === "neutral") {
    delete world.neutrals[entity.id];
  }

  world.grid[entity.r][entity.c].entityId = null;
  pushEvent(world, "bad", `${entity.id} died.`);
}

export function deathSystem(world: WorldState) {
  for (const enemy of Object.values(world.enemies)) {
    if (enemy.hp > 0) continue;

    handleDeath(world, enemy, "enemy");
  }

  for (const neutral of Object.values(world.neutrals)) {
    if (neutral.hp > 0) continue;
    handleDeath(world, neutral, "neutral");
  }

  if (world.player.hp <= 0) {
    world.gameOver = true;
  }
}
