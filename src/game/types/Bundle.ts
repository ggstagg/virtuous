import type { Item } from "./Item";

export type Bundle = {
    kind: "bundle";
    gold: number;
    food: number;
    items: Item[];
}