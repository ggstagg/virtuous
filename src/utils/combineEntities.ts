import type { EntityBase } from "../game/types/EntityBase";
import type { WorldState } from "../game/types/WorldState";

export function combineEntities(world: WorldState): EntityBase[] {
  return [
    ...Object.values(world.enemies),
    ...Object.values(world.neutrals),
    world.player,
  ];
}
