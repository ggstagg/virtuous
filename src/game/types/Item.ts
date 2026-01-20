export type ItemType = "gold" | "food" | "key" | "weapon";

export interface Item {
  id: string;
  kind: "item";
  type: ItemType;

  quantity?: number;
  name?: string;
  keyId?: string;
}
