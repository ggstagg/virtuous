import type { Enemy } from "./Enemy";
import type { Neutral } from "./Neutral";
import type { Player } from "./Player";
import type { Tile } from "./Tile";

export interface WorldState {
    grid: Tile[][];

    player: Player;

    enemies: Record<string, Enemy>;
    neutrals: Record<string, Neutral>;

    tick: number;
    seed: number;
}