function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

export function computeLayout() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Outer padding around frame
  const framePad = clamp(Math.round(vw * 0.02), 36, 72);
  const gap = clamp(Math.round(vw * 0.015), 10, 24);

  // Sidebar width
  const sidebarW = clamp(Math.round(vw * 0.22), 260, 420);

  // Canvas size from remaining space
  const viewW = clamp(vw - framePad * 2 - gap - sidebarW, 520, 1200);
  const viewH = clamp(vh - framePad * 2, 420, 900);

  return { framePad, gap, sidebarW, viewW, viewH };
}
