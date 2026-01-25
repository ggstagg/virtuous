import { getColorFromTailwind } from "../render/debugDrawHelpers/color";

export const COLORS = {
  player: getColorFromTailwind("--color-player"),
  enemy: getColorFromTailwind("--color-enemy"),
  neutral: getColorFromTailwind("--color-neutral"),
};
