import { useEffect, useState } from "react";
import { cropAtlasRegionToDataURL } from "../render/sprites/spriteCrop";

export function SpriteSlicePanel({
  children,
  className = "",
  src,
  cellSize,
  col,
  row,
  wCells,
  hCells,
  borderCells = 1,
  scale = 2,
}: {
  children: React.ReactNode;
  className?: string;
  src: string;
  cellSize: number;
  col: number;
  row: number;
  wCells: number;
  hCells: number;
  borderCells?: number;
  scale?: number;
}) {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    let alive = true;
    cropAtlasRegionToDataURL({ src, cellSize, col, row, wCells, hCells }).then(
      (u) => alive && setUrl(u),
    );
    return () => {
      alive = false;
    };
  }, [src, cellSize, col, row, wCells, hCells]);

  const borderPx = borderCells * cellSize * scale;

  return (
    <div
      className={className}
      style={{
        imageRendering: "pixelated",

        borderStyle: "solid",
        borderWidth: borderPx,
        borderImageSource: url ? `url(${url})` : undefined,

        borderImageSlice: `${cellSize} fill`,
        borderImageRepeat: "stretch",
      }}
    >
      {children}
    </div>
  );
}
