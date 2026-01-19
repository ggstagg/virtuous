import { DIRECTIONS, type Direction } from "../game/types/Direction";

export function directionFromTo(
  r0: number,
  c0: number,
  r1: number,
  c1: number,
): Direction | null {
  console.log(`r0: ${r0}, c0: ${c0}, r1: ${r1}, c1: ${c1}`);
  const dr = r1 - r0;
  const dc = c1 - c0;

  if (dr === -1 && dc === 0) return DIRECTIONS.North;
  if (dr === 1 && dc === 0) return DIRECTIONS.South;
  if (dr === 0 && dc === 1) return DIRECTIONS.East;
  if (dr === 0 && dc === -1) return DIRECTIONS.West;

  return null;
}
