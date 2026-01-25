function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

export function computeLayout() {
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;

  const border = 48; 
  const availW = vw - border;
  const availH = vh - border;

  const framePad = clamp(Math.round(availW * 0.02), 36, 72);
  const gap = clamp(Math.round(availW * 0.015), 10, 24);

  const sidebarW = clamp(Math.round(availW * 0.22), 260, 420);

  const viewW = clamp(availW - framePad * 2 - gap - sidebarW, 520, 1200);
  const viewH = clamp(availH - framePad * 2, 420, 900);

  return { framePad, gap, sidebarW, viewW, viewH };
}
