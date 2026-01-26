export async function cropAtlasRegionToDataURL(opts: {
  src: string;
  cellSize: number;
  col: number;  
  row: number; 
  wCells: number;
  hCells: number;
}) {
  const img = new Image();
  img.src = opts.src;
  await img.decode();

  const sx = opts.col * opts.cellSize;
  const sy = opts.row * opts.cellSize;
  const sw = opts.wCells * opts.cellSize;
  const sh = opts.hCells * opts.cellSize;

  const c = document.createElement("canvas");
  c.width = sw;
  c.height = sh;

  const ctx = c.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

  return c.toDataURL("image/png");
}
