import { DirectionDelta } from "../../types/Direction";
import type { WorldState } from "../../types/WorldState";
import { applyDamage } from "../combat";
import { pushEvent } from "../eventLog";
import { consumeAttack, type InputState } from "../inputSystem";
import { inBounds } from "../movementHelpers";

export function playerAttackSystem(
  world: WorldState,
  input: InputState,
  dtMs: number,
) {
  const player = world.player;

  player.attackCooldownMs = Math.max(0, player.attackCooldownMs - dtMs);

  if (player.attackCooldownMs > 0) {
    consumeAttack(input);
    return;
  }

  if (!consumeAttack(input)) return;

  const { dr, dc } = DirectionDelta[player.facing];
  const nextR = player.r + dr;
  const nextC = player.c + dc;

  if (!inBounds(world, nextR, nextC)) {
    player.attackCooldownMs = player.attackIntervalMs;
    return;
  }

  const tile = world.grid[nextR][nextC];
  const targetId = tile.entityId;

  if (!targetId) {
    player.attackCooldownMs = player.attackIntervalMs;
    return;
  }

  const enemy = world.enemies[targetId];
  if (enemy) {
    applyDamage(world, enemy, player, player.attackPower);
    pushEvent(
      world,
      "good",
      `${player.id} hit ${enemy.id} for ${player.attackPower} damage.`,
    );
    player.attackCooldownMs = player.attackIntervalMs;
    return;
  }

  const neutral = world.neutrals[targetId];
  if (neutral) {
    applyDamage(world, neutral, player, player.attackPower);
    pushEvent(
      world,
      "bad",
      `${player.id} hit ${neutral.id} for ${player.attackPower} damage.`,
    );
    player.attackCooldownMs = player.attackIntervalMs;
    return;
  }

  player.attackCooldownMs = player.attackIntervalMs;
}
