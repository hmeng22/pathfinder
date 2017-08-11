var cubeId = 0;

function Cube() {
  Object.defineProperty(this, 'id', {
    value: cubeId++
  });

  this.index = 0;
  this.x = 0;
  this.y = 0;

  this.isBegin = false;
  this.isEnd = false;
  this.isObstacle = false;

  // type : [begin, end, path, obstacle]
  this.type = 'path';
  this.walkingCost = 0;

  this.isPath = false;
  this.father = null;
  this.fatherDirection = null;

  this.isRedBorder = false;
  this.isGreenBorder = false;
  this.isBlueBorder = false;

  // AStar : F = G + H;
  this.isOpen = false;
  this.isClosed = false;
  this.F = 0.0;
  this.G = 0.0;
  this.H = 0.0;
  this.isShowFGH = false;

  // BFS, DFS
  this.isVisited = false;
  this.sequence = 0.0;

  // Dijkstar
  var _weightValue = 10.0;
  Object.defineProperty(this, 'weight', {
    get: function() {
      if (this.isObstacle) {
        return Number.POSITIVE_INFINITY;
      } else {
        return _weightValue;
      }
    },
    set: function(newValue) {
      if (newValue >= 0) {
        this.isObstacle = false;
        _weightValue = newValue;
      } else {
        this.isObstacle = true;
      }
    },
    enumerable: true
  });

  // Bi-directional
  this.markedByBegin = false;
  this.markedByEnd = false;
}

Object.assign(Cube.prototype, {});

export {Cube};
