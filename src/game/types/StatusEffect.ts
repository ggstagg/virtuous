export type StatusEffectType =
  | "stunned"
  | "slowed"
  | "poisoned"
  | "burning"
  | "fear"
  | "rage";

  export interface StatusEffect {
    type: StatusEffectType;
    duration: number;
    magnitude?: number;
  }