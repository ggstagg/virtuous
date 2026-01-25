import type { WorldState } from "../../types/WorldState";
import type { Enemy } from "../../types/Enemy";
import type { PathNode } from "../../types/Pathfinding";
import { manhattanDistance } from "../pathfinding/manhattan";
import { pushEvent } from "../eventLog";
import type { EntityBase } from "../../types/EntityBase";
import { directionFromTo } from "../../../utils/distanceUtils";
import { pickWanderDirection } from "./pickWanderDirection";

function pickClosestTarget(world: WorldState, enemy: Enemy): EntityBase | null {
  let closestEntity: { entity: EntityBase; distance: number } | null = null;

  for (const entity of [...Object.values(world.neutrals), world.player]) {
    if (entity.hp <= 0) continue;
    const entityDistance = manhattanDistance(
      enemy.r,
      enemy.c,
      entity.r,
      entity.c,
    );
    if (entityDistance > enemy.visionRadius) continue;
    if (!closestEntity || entityDistance < closestEntity.distance)
      closestEntity = { entity, distance: entityDistance };
  }

  return closestEntity?.entity ?? null;
}

function clearPlan(enemy: Enemy) {
  enemy.isAggroed = false;
  enemy.currentPath = null;
  enemy.pathIndex = 0;
  enemy.nextDirection = null;
  enemy.pathGoalR = null;
  enemy.pathGoalC = null;
}

export function enemyAISystem(world: WorldState, dtMs: number) {
  for (const enemy of Object.values(world.enemies)) {
    enemy.thinkCooldownMs -= dtMs;
    if (enemy.thinkCooldownMs > 0) continue;
    if (enemy.targetR !== null && enemy.targetC !== null) continue;
    enemy.thinkCooldownMs = enemy.thinkIntervalMs;

    const targetEntity = pickClosestTarget(world, enemy);
    if (!targetEntity) {
      clearPlan(enemy);
      enemy.targetEntityId = null;

      enemy.wanderCooldownMs = Math.max(
        0,
        enemy.wanderCooldownMs - enemy.thinkIntervalMs,
      );
      console.log(enemy.wanderCooldownMs);
      if (enemy.wanderCooldownMs > 0) {
        enemy.nextDirection = null;
        continue;
      }
      if (Math.random() < 0.2) enemy.wanderCooldownMs = enemy.wanderIntervalMs;

      const direction = pickWanderDirection(world, enemy);
      enemy.nextDirection = direction;
      enemy.wanderDirection = direction;
      continue;
    }

    const dist = manhattanDistance(
      enemy.r,
      enemy.c,
      targetEntity.r,
      targetEntity.c,
    );
    if (dist === 1) {
      enemy.nextDirection = directionFromTo(
        enemy.r,
        enemy.c,
        targetEntity.r,
        targetEntity.c,
      );

      enemy.currentPath = null;
      enemy.pathIndex = 0;
      continue;
    }
    if (dist > enemy.visionRadius) {
      clearPlan(enemy);
      continue;
    }

    if (!enemy.isAggroed)
      pushEvent(world, "bad", `${targetEntity.id} aggroed ${enemy.id}`);

    enemy.isAggroed = true;
    const goalChanged =
      enemy.pathGoalR !== targetEntity.r || enemy.pathGoalC !== targetEntity.c;
    if (goalChanged) {
      enemy.currentPath = null;
      enemy.pathIndex = 0;
      enemy.nextDirection = null;
      enemy.pathGoalR = null;
      enemy.pathGoalC = null;
    }

    // if no plan or plan exhausted, compute a new path
    const pathDone =
      enemy.currentPath === null || enemy.pathIndex >= enemy.currentPath.length;

    if (pathDone) {
      const newPath = enemy.pathfinder(world, {
        startR: enemy.r,
        startC: enemy.c,
        goalR: targetEntity.r,
        goalC: targetEntity.c,
        visionCenterR: enemy.r,
        visionCenterC: enemy.c,
        visionRadius: enemy.visionRadius,
        maxDepth: enemy.visionRadius,
        maxNodes: 500,
      });
      console.log("new path: ", newPath);

      if (!newPath || newPath.length < 2) {
        enemy.targetEntityId = null;

        enemy.wanderCooldownMs = Math.max(
          0,
          enemy.wanderCooldownMs - enemy.thinkIntervalMs,
        );
        console.log(enemy.wanderCooldownMs);
        if (enemy.wanderCooldownMs > 0) {
          enemy.nextDirection = null;
          continue;
        }
        if (Math.random() < 0.2)
          enemy.wanderCooldownMs = enemy.wanderIntervalMs;

        const direction = pickWanderDirection(world, enemy);
        enemy.nextDirection = direction;
        enemy.wanderDirection = direction;
        continue;
      }

      enemy.currentPath = newPath;
      enemy.pathIndex = 1; // 0 is current tile, 1 is next step
      enemy.pathGoalR = targetEntity.r;
      enemy.pathGoalC = targetEntity.c;
    }

    const next: PathNode | undefined = enemy.currentPath?.[enemy.pathIndex];
    if (!next) {
      clearPlan(enemy);
      continue;
    }
    console.log("next: ", next);

    const dir = directionFromTo(enemy.r, enemy.c, next.r, next.c);
    console.log("next direction: ", dir);
    if (!dir) {
      // path isn't adjacent or got invalidated by changes; recompute next think
      clearPlan(enemy);
      continue;
    }

    enemy.nextDirection = dir;
    // enemy.pathIndex += 1;
  }
}
