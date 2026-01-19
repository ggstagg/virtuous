import { directionFromTo } from "../../../utils/distanceUtils";
import type { Enemy } from "../../types/Enemy";
import type { WorldState } from "../../types/WorldState";
import { applyDamage } from "../combat";
import { pushEvent } from "../eventLog";
import { manhattanDistance } from "../pathfinding/manhattan";

function isFacing(enemy: Enemy, targetR: number, targetC: number) {
  const direction = directionFromTo(enemy.r, enemy.c, targetR, targetC);
  return direction !== null && direction === enemy.facing;
}

export function enemyAttackSystem(world: WorldState, dtMs: number) {
  for (const enemy of Object.values(world.enemies)) {
    if (enemy.hp <= 0) continue;

    enemy.attackCooldownMs = Math.max(0, enemy.attackCooldownMs - dtMs);
    if (enemy.attackCooldownMs > 0) continue;

    for (const entity of [...Object.values(world.neutrals), world.player]) {
      if (entity.hp <= 0) continue;

      const d = manhattanDistance(enemy.r, enemy.c, entity.r, entity.c);
      if (d !== 1) continue;
      if (!isFacing(enemy, entity.r, entity.c)) continue;

      const damage = Math.max(1, enemy.attackPower);
      applyDamage(world, entity, damage);
      enemy.attackCooldownMs = enemy.attackIntervalMs;

      pushEvent(
        world,
        "bad",
        `${enemy.id} hit ${entity.id} for ${enemy.attackPower} damage`,
      );
      break;
    }
  }
}
