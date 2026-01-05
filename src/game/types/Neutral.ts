import type { Direction } from "./Direction";
import type { EntityBase } from "./EntityBase";
import type { SocialGroup } from "./SocialGroup";

export type NeutralEntityType = "pig" | "miser" | "villager" | "maiden";

export interface Neutral extends EntityBase {
  neutralEntityType: NeutralEntityType;
  socialGroup: SocialGroup;

  bravery: number;
  happiness: number;

  thinkCooldownMs: number;
  thinkIntervalMs: number;

  nextDirection: Direction | null;
}
