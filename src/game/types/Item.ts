export type ItemType = "gold" | "food";

export interface Item {
  id: string;
  type: ItemType;
  quantity: number;
}
