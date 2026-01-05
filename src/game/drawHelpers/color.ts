export function getColorFromTailwind(tailwindVariableName: string) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(tailwindVariableName)
    .trim();
}
