export function manhattanDistance(
  r0: number,
  c0: number,
  r1: number,
  c1: number
) {
  return Math.abs(r0 - r1) + Math.abs(c0 - c1);
}
