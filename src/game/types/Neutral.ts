import type { EntityBase } from "./EntityBase";
import type { NPC } from "./NPC";
import type { SocialGroup } from "./SocialGroup";

export type NeutralEntityType = "pig" | "miser";

export interface Neutral extends EntityBase, NPC {
  neutralEntityType: NeutralEntityType;
  socialGroup: SocialGroup;

  bravery: number;
  happiness: number;
}
