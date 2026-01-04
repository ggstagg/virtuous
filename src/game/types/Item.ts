export type ItemType = "gold" | "food" | "key" | "weapon";

export interface Item {
  id: string;
  type: ItemType;

  quantity?: number;
  name?: string;
  keyId?: string
}
