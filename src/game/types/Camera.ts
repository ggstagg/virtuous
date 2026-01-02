export interface Camera {
  // top-left corner of current view
  x: number;
  y: number;

  // size of view on canvas
  viewW: number;
  viewH: number;

  zoom: number;

  // smoothing (bigger number = floatier)
  followHalfLifeMs: number;
}
