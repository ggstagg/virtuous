import type { EntityBase } from "./EntityBase";
import type { NPC } from "./NPC";

export interface Enemy extends EntityBase, NPC {
  behaviorType: "chaser" | "wanderer";
}
