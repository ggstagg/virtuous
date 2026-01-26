import { DirectionDelta } from "../../types/Direction";
import type { PlayerActions } from "../../types/Player";
import type { WorldState } from "../../types/WorldState";
import { applyDamage } from "../combat";
import { pushEvent } from "../eventLog";
import { consumeAction, type InputState } from "../inputSystem";
import { inBounds } from "../movementHelpers";

export function playerActionSystem(
  world: WorldState,
  input: InputState,
  dtMs: number,
) {
  const player = world.player;

  player.actionCooldownMs = Math.max(0, player.actionCooldownMs - dtMs);

  if (player.actionCooldownMs > 0) {
    consumeAction(input);
    return;
  }

  const action: PlayerActions = consumeAction(input);
  if (!action) return;

  if (action === "attack") {
    const { dr, dc } = DirectionDelta[player.facing];
    const nextR = player.r + dr;
    const nextC = player.c + dc;

    if (!inBounds(world, nextR, nextC)) {
      player.actionCooldownMs = player.actionIntervalMs;
      return;
    }

    const tile = world.grid[nextR][nextC];
    const targetId = tile.entityId;

    if (!targetId) {
      player.actionCooldownMs = player.actionIntervalMs;
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
      player.actionCooldownMs = player.actionIntervalMs;
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
      player.actionCooldownMs = player.actionIntervalMs;
      return;
    }
  } else if (action === "heal") {
    if (player.food < 5) {
      pushEvent(
        world,
        "info",
        `${player.id} tried to eat but not enough food (5 needed).`,
      );
    } else if (player.hp >= player.maxHp) {
      pushEvent(
        world,
        "info",
        `${player.id} tried to eat but already at max HP.`,
      );
    } else {
      player.food = Math.max(0, player.food - 5);
      const previousHP = player.hp;
      player.hp = Math.min(player.maxHp, player.hp + 3);
      pushEvent(
        world,
        "good",
        `${player.id} ate food to gain ${player.hp - previousHP} HP.`,
      );
      player.actionCooldownMs = player.actionIntervalMs;
    }
  }

  player.actionCooldownMs = player.actionIntervalMs;
}
