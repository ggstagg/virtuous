import type { Direction } from "./Direction";

export interface Portal {
  id: string;
  r: number;
  c: number;
  allowedDirections: Direction[];
  destinationZone: string;
  destinationR: number;
  destinationC: number;
  isLocked: boolean;
  requiresKey?: string;
}
