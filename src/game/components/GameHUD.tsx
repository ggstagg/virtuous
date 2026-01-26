import { useEffect, useRef, useState } from "react";
import type { WorldState } from "../types/WorldState";
import type { GameEvent } from "../types/GameEvent";
import { SpriteSlicePanel } from "./SpriteSlicePanel";
import GuiUrl from "../assets/gui/GUI0.png";

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
  uiVersion,
}: {
  worldRef: WorldRef;
  sidebarW: number;
  viewH: number;
  uiVersion: number;
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
    console.log(uiVersion);
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
  }, [worldRef, uiVersion]);

  const hpPct = snap.maxHp <= 0 ? 0 : clamp(snap.hp / snap.maxHp, 0, 1);

  const logRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = logRef.current;
    if (!el) return;

    // scroll to bottom
    el.scrollTop = el.scrollHeight;
  }, [snap.events.length]);

  return (
    <div
      className="flex flex-col"
      style={{ width: sidebarW, height: viewH, gap: 12 }}
    >
      {/* HP */}
      <SpriteSlicePanel
        src={GuiUrl}
        cellSize={16}
        col={13}
        row={13}
        wCells={3}
        hCells={3}
        borderCells={1}
        scale={2}
        className="text-white"
      >
        <div className="py-3">
          <div className="font-semibold mb-2">Player</div>

          <div className="text-sm mb-1">
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
      </SpriteSlicePanel>

      {/* Inventory */}
      <SpriteSlicePanel
        src={GuiUrl}
        cellSize={16}
        col={13}
        row={13}
        wCells={3}
        hCells={3}
        borderCells={1}
        scale={2}
        className="text-white flex-1 min-h-44"
      >
        <div className="py-3 h-full">
          <div className="font-semibold mb-2">Inventory</div>
          <div className="text-sm">Gold: {snap.gold}</div>
          <div className="text-sm">Food: {snap.food}</div>
        </div>
      </SpriteSlicePanel>

      {/* Status / Event Log */}
      <SpriteSlicePanel
        src={GuiUrl}
        cellSize={16}
        col={13}
        row={13}
        wCells={3}
        hCells={3}
        borderCells={1}
        scale={2}
        className="text-white flex flex-col max-h-50"
      >
        <div className="py-3 flex flex-col h-full">
          <div className="text-indigo-200 font-semibold">Event Log</div>

          <div ref={logRef} className="flex-1 min-h-30 overflow-auto pr-1">
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
      </SpriteSlicePanel>
    </div>
  );
}
