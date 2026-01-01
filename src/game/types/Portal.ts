import type { DIRECTIONS } from "./Direction";

export interface Portal {
  id: string;
  r: number;
  c: number;
  allowedDirections: Directions[];
  destinationZone: string;
  destinationR: number;
  destinationC: number;
  isLocked: boolean;
  requiresKey?: string;
}
