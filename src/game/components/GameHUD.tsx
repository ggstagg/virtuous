import { useEffect, useState } from "react";
import type { WorldState } from "../types/WorldState";
import type { GameEvent } from "../types/GameEvent";

type HudSnapshot = {
  hp: number;
  maxHp: number;
  gold: number;
  food: number;
  eventCount: number;
  events: GameEvent[];
  gameOver: boolean;
};

type WorldRef = { current: WorldState };

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

export function GameHUD({
  worldRef,
  sidebarW,
  viewH,
}: {
  worldRef: WorldRef;
  sidebarW: number;
  viewH: number;
}) {
  const [snap, setSnap] = useState<HudSnapshot>({
    hp: 0,
    maxHp: 1,
    gold: 0,
    food: 0,
    eventCount: 0,
    events: [],
    gameOver: false,
  });

  useEffect(() => {
    let raf = 0;

    const tick = () => {
      const world = worldRef.current;

      setSnap((prev) => {
        const next: HudSnapshot = {
          hp: world.player.hp,
          maxHp: world.player.maxHp,
          gold: world.player.gold,
          food: world.player.food,
          eventCount: world.eventLog.length,
          events: world.eventLog.slice(-8),
          gameOver: world.gameOver,
        };

        // TODO: find another way of detecting new update other than eventcounter; its not very accurate
        if (
          prev.hp === next.hp &&
          prev.maxHp === next.maxHp &&
          prev.gold === next.gold &&
          prev.food === next.food &&
          prev.gameOver === next.gameOver &&
          prev.eventCount === next.eventCount
        ) {
          return prev;
        }
        return next;
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [worldRef]);

  const hpPct = snap.maxHp <= 0 ? 0 : clamp(snap.hp / snap.maxHp, 0, 1);

  const hpH = clamp(Math.round(viewH * 0.18), 90, 170);
  const statusH = clamp(Math.round(viewH * 0.24), 120, 240);

  return (
    <div className="flex flex-col" style={{ width: sidebarW, gap: 12 }}>
      <div className="rounded-lg bg-blue-600 p-3" style={{ height: hpH }}>
        <div className="text-white font-semibold mb-2">Player</div>

        <div className="text-white text-sm mb-1">
          HP: {snap.hp} / {snap.maxHp}
        </div>

        <div className="h-3 rounded bg-red-950/40 overflow-hidden">
          <div
            className="h-full bg-red-500"
            style={{ width: `${Math.round(hpPct * 100)}%` }}
          />
        </div>

        {snap.gameOver && (
          <div className="mt-2 text-white/90 text-sm font-semibold">
            GAME OVER
          </div>
        )}
      </div>

      <div className="rounded-lg bg-zinc-800 p-3 flex-1 min-h-0">
        <div className="text-white font-semibold mb-2">Inventory</div>
        <div className="text-white text-sm">Gold: {snap.gold}</div>
        <div className="text-white text-sm">Food: {snap.food}</div>
      </div>

      <div
        className="rounded-lg bg-indigo-900/40 p-3 flex flex-col overflow-hidden"
        style={{ height: statusH }}
      >
        <div className="text-indigo-200 font-semibold mb-2">Event Log</div>

        {/* scroll area */}
        <div className="flex-1 min-h-0 overflow-auto pr-1">
          <div className="flex flex-col gap-1">
            {snap.events.map((e) => (
              <div
                key={e.id}
                className={[
                  "text-xs leading-snug break-words",
                  e.type === "bad" ? "text-red-200" : "",
                  e.type === "good" ? "text-emerald-200" : "",
                  e.type === "info" ? "text-indigo-200/80" : "",
                ].join(" ")}
              >
                {e.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
