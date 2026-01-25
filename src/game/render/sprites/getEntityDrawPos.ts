export function getEntityDrawRC(entity: {
  r: number;
  c: number;
  startR: number;
  startC: number;
  targetR: number | null;
  targetC: number | null;
  moveProgressMs: number;
  moveDurationMs: number;
}) {
  let drawR = entity.r;
  let drawC = entity.c;

  if (entity.targetR !== null && entity.targetC !== null) {
    const t =
      entity.moveDurationMs <= 0
        ? 1
        : Math.min(1, entity.moveProgressMs / entity.moveDurationMs);

    drawR = entity.startR + (entity.targetR - entity.startR) * t;
    drawC = entity.startC + (entity.targetC - entity.startC) * t;
  }

  return { drawR, drawC };
}
