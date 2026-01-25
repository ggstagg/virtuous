import { TILE_SIZE } from "../../constants/viewConstants";
import { DIRECTIONS } from "../../types/Direction";
import type { WorldState } from "../../types/WorldState";
import { drawSpriteCell } from "../sprites/drawSpriteCell";
import { getEntityDrawRC } from "../sprites/getEntityDrawPos";
import { ENEMY_BASE, NEUTRAL_BASE, PLAYER_BASE } from "../sprites/spriteDefs";
import type { SpriteSheets } from "../sprites/spriteSheet";

function isMoving(e: { targetR: number | null; targetC: number | null }) {
  return e.targetR !== null && e.targetC !== null;
}

function animFrame(world: WorldState) {
  return (Math.floor(world.tick / 8) & 1) as 0 | 1;
}

export function drawEntities(
  ctx: CanvasRenderingContext2D,
  world: WorldState,
  sprites: SpriteSheets,
) {
  const player = world.player;

  const frame = isMoving(player) ? (player.animationFrame ?? 0) : 0;
  const sheet = frame === 0 ? sprites.player0 : sprites.player1;

  const { drawR, drawC } = getEntityDrawRC(player);
  const x = drawC * TILE_SIZE;
  const y = drawR * TILE_SIZE;

  drawSpriteCell(ctx, sheet, PLAYER_BASE, x, y, player.facing === DIRECTIONS.West);

  for (const enemy of Object.values(world.enemies)) {
    if (enemy.hp <= 0) continue;

    const frame = isMoving(enemy) ? animFrame(world) : 0;
    const sheet = frame === 0 ? sprites.undead0 : sprites.undead1;

    const { drawR, drawC } = getEntityDrawRC(enemy);
    const x = drawC * TILE_SIZE;
    const y = drawR * TILE_SIZE;

    drawSpriteCell(
      ctx,
      sheet,
      ENEMY_BASE,
      x,
      y,
      enemy.facing === DIRECTIONS.West,
    );
  }

  for (const neutral of Object.values(world.neutrals)) {
    if (neutral.hp <= 0) continue;
    const frame = isMoving(neutral) ? animFrame(world) : 0;
    const sheet = frame === 0 ? sprites.player0 : sprites.player1;

    const { drawR, drawC } = getEntityDrawRC(neutral);
    const x = drawC * TILE_SIZE;
    const y = drawR * TILE_SIZE;

    drawSpriteCell(
      ctx,
      sheet,
      NEUTRAL_BASE,
      x,
      y,
      neutral.facing === DIRECTIONS.West,
    );
  }
}
