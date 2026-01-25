import { TILE_SIZE } from "../../constants/viewConstants";
import { SPRITE_CELL_SIZE } from "./spriteDefs";

export function drawSpriteCell(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  cell: { row: number; col: number },
  worldX: number,
  worldY: number,
  flip: boolean,
) {
  const spriteX = cell.col * SPRITE_CELL_SIZE;
  const spriteY = cell.row * SPRITE_CELL_SIZE;

  const destinationX = worldX;
  const destinationY = worldY;
  const destinationWidth = TILE_SIZE;
  const destinationHeight = TILE_SIZE;

  ctx.imageSmoothingEnabled = false;

  if (!flip) {
    ctx.save();
    ctx.translate(destinationX + destinationWidth, destinationY);
    ctx.scale(-1, 1);
    ctx.drawImage(
      image,
      spriteX,
      spriteY,
      SPRITE_CELL_SIZE,
      SPRITE_CELL_SIZE,
      0,
      0,
      destinationWidth,
      destinationHeight,
    );
    ctx.restore();
  } else {
    ctx.drawImage(
      image,
      spriteX,
      spriteY,
      SPRITE_CELL_SIZE,
      SPRITE_CELL_SIZE,
      destinationX,
      destinationY,
      destinationWidth,
      destinationHeight,
    );
  }
}
