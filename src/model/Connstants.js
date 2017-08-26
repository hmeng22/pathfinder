export var MovingCost = {
  Base: 10,
  Orthogonal: 10,
  Diagonal: 14,
  Turning: 4,
  Stay: 0
};

export var Heuristic = {
  Manhattan: 0,
  Euclidean: 1,
  Octile: 2,
  Chebyshev: 3
};

export var CornerWalk = {
  Orthogonal: 0,
  Diagonal: 1
};

// Convert direction vector (dx, dy) to Direction
// 0,0 0,1 0,2
// 1,0 1,1 1,2
// 2,0 2,1 2,2
//
// (fx, fy)  : (1, 1)
// (x, y)    : (*, *)
//
// dx = x - fx;
// dy = y - fy;
//
// BottomRight : (1, 1)    : should be UpLeft 4
// Bottom      : (1, 0)    : should be Up 5
// BottomLeft  : (1, -1)   : should be UpRight 6
// Left        : (0, -1)   : should be Right 7
// UpLeft      : (-1, -1)  : should be BottomRight 0
// Up          : (-1, 0)   : should be Bottom 1
// UpRight     : (-1, 1)   : should be BottomLeft 2
// Right       : (0, 1)    : should be Left 3
// function fixDirection(dx, dy) {
//   var angle = Math.atan2(dy, dx);
//   var degrees = 180 * angle / Math.PI;
//   var index = (360 + Math.round(degrees)) % 360 / 45;
//   var fixedIndex = Math.abs(index - 13) % 8;
//   return fixedIndex;
// }
// Directions
export var Direction = {
  BottomRight: 0,
  Bottom: 1,
  BottomLeft: 2,
  Left: 3,
  UpLeft: 4,
  Up: 5,
  UpRight: 6,
  Right: 7
};

//clock-wise direction
export var DeltaLength = 8;
export var Delta = [
  {
    x: -1,
    y: -1
  }, {
    x: -1,
    y: 0
  }, {
    x: -1,
    y: 1
  }, {
    x: 0,
    y: 1
  }, {
    x: 1,
    y: 1
  }, {
    x: 1,
    y: 0
  }, {
    x: 1,
    y: -1
  }, {
    x: 0,
    y: -1
  }
];
export var DeltaReversedDirection = [
  Direction.BottomRight,
  Direction.Bottom,
  Direction.BottomLeft,
  Direction.Left,
  Direction.UpLeft,
  Direction.Up,
  Direction.UpRight,
  Direction.Right
];
