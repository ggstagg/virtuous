import Player0Url from "../../assets/sprites/Player0.png";
import Player1Url from "../../assets/sprites/Player1.png";
import Undead0Url from "../../assets/sprites/Undead0.png";
import Undead1Url from "../../assets/sprites/Undead1.png";
import FloorUrl from "../../assets/environment/Floor.png";
import WallUrl from "../../assets/environment/Wall.png";
import Chest0Url from "../../assets/items/Chest0.png";
import FoodUrl from "../../assets/items/Food.png";
import KeyUrl from "../../assets/items/Key.png";
import MoneyUrl from "../../assets/items/Money.png";

export type SheetKey =
  | "player0"
  | "player1"
  | "undead0"
  | "undead1"
  | "floor"
  | "wall"
  | "chest0"
  | "food"
  | "key"
  | "money";

export type SpriteSheets = Record<SheetKey, HTMLImageElement>;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    image.src = src;
  });
}

export async function loadSpriteSheets(): Promise<SpriteSheets> {
  const [
    player0,
    player1,
    undead0,
    undead1,
    floor,
    wall,
    chest0,
    food,
    key,
    money,
  ] = await Promise.all([
    loadImage(Player0Url),
    loadImage(Player1Url),
    loadImage(Undead0Url),
    loadImage(Undead1Url),
    loadImage(FloorUrl),
    loadImage(WallUrl),
    loadImage(Chest0Url),
    loadImage(FoodUrl),
    loadImage(KeyUrl),
    loadImage(MoneyUrl),
  ]);

  return {
    player0,
    player1,
    undead0,
    undead1,
    floor,
    wall,
    chest0,
    food,
    key,
    money,
  };
}
