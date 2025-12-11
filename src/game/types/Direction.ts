export const Direction = {
  North: "north",
  South: "south",
  West: "west",
  East: "east",
};

export type Direction = (typeof Direction)[keyof typeof Direction];

// dr = change in row, dc = change in column
export const DirectionDelta: Record<Direction, { dr: number; dc: number }> = {
  north: { dr: -1, dc: 0 },
  south: { dr: 1, dc: 0 },
  west: { dr: 0, dc: -1 },
  east: { dr: 0, dc: 1 },
};
