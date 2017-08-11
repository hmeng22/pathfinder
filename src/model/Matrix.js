import {
  MovingCost,
  Heuristic,
  CornerWalk,
  Direction,
  DeltaLength,
  Delta
} from './Connstants'
import {Cube} from './Cube'

var matrixId = 0;

function Matrix(width, height) {
  Object.defineProperty(this, 'id', {
    value: matrixId++
  });

  this.width = width || 10;
  this.height = height || 10;
  Object.defineProperty(this, 'size', {
    get: function() {
      return this.width * this.height;
    },
    enumerable: true
  });

  this.sequence = 1;

  this.cubes = this.initCubes();

  this.cornerWalk = CornerWalk.Orthogonal;
  this.heuristic = Heuristic.Manhattan;

  this.graph = this.buildGraph();

  this.begin = {
    x: 0,
    y: 0
  };
  this.end = {
    x: 9,
    y: 9
  };

  this.setBegin(this.begin.x, this.begin.y);
  this.setEnd(this.end.x, this.end.y);
}

Object.assign(Matrix.prototype, {
  setWidthHeight: function(w, h) {
    this.width = w;
    this.height = h;
  },

  getXYFromIndex: function(i) {
    return {
      x: parseInt(i / this.width),
      y: i % this.width
    }
  },

  getIndexFromXY: function(x, y) {
    return x * this.width + y;
  },

  getCubeFromXY: function(x, y) {
    return this.getCubeFromIndex(this.getIndexFromXY(x, y));
  },

  getCubeFromIndex: function(i) {
    return i > -1 && i < this.size
      ? this.cubes[i]
      : {
        isObstacle: true
      };
  },

  setBegin: function(x, y) {
    var c = this.getCubeFromXY(x, y);
    this.begin.x = x;
    this.begin.y = y;
    c.isBegin = true;
    c.type = 'begin';
  },

  setEnd: function(x, y) {
    var c = this.getCubeFromXY(x, y);
    this.end.x = x;
    this.end.y = y;
    c.isEnd = true;
    c.type = 'end';
  },

  setTypeObstacle: function(x, y) {
    var c = this.getCubeFromXY(x, y);
    c.isObstacle = true;
    c.type = 'obstacle';
  },

  setTypePath: function(x, y) {
    var c = this.getCubeFromXY(x, y);
    c.isObstacle = false;
    c.type = 'path';
  },

  setCornerWalk: function(cw) {
    switch (cw) {
      case 'Orthogonal':
        this.cornerWalk = CornerWalk.Orthogonal;
        break;
      case 'Diagonal':
        this.cornerWalk = CornerWalk.Diagonal;
        break;
    }
  },

  setHeuristic: function(h) {
    switch (h) {
      case 'Manhattan':
        this.heuristic = Heuristic.Manhattan;
        break;
      case 'Euclidean':
        this.heuristic = Heuristic.Euclidean;
        break;
      case 'Octile':
        this.heuristic = Heuristic.Octile;
        break;
      case 'Chebyshev':
        this.heuristic = Heuristic.Chebyshev;
        break;
    }
  },

  isInsideBoundary: function(x, y) {
    return x > -1 && x < this.width && y > -1 && y < this.height;
  },

  isCubeWalkable: function(x, y) {
    return !this.getCubeFromXY(x, y).isObstacle && this.isInsideBoundary(x, y);
  },

  isCornerWalkable: function(x, y, d) {
    if (this.getCubeFromXY(x + Delta[d].x, y + Delta[d].y).isObstacle) {
      return false;
    }

    if (d == Direction.UpLeft || d == Direction.UpRight || d == Direction.BottomRight || d == Direction.BottomLeft) {
      if (this.cornerWalk == CornerWalk.Orthogonal) {
        return false;
      } else if (this.cornerWalk == CornerWalk.Diagonal) {
        if (this.getCubeFromXY(x + Delta[d].x, y).isObstacle || this.getCubeFromXY(x, y + Delta[d].y).isObstacle) {
          return false;
        }
      }
    }

    return true;
  },

  isDeltaCubeWalkable: function(x, y, d) {
    return !this.getCubeFromXY(x, y).isObstacle && this.isInsideBoundary(x + Delta[d].x, y + Delta[d].y) && this.isCornerWalkable(x, y, d);
  },

  heuristicManhattan: function(dx, dy) {
    return dx + dy;
  },

  heuristicEuclidean: function(dx, dy) {
    return Math.sqrt(dx * dx + dy * dy);
  },

  heuristicOctile: function(dx, dy) {
    var F = Math.SQRT2 - 1;
    return (dx < dy)
      ? F * dx + dy
      : F * dy + dx;
  },

  heuristicChebyshev: function(dx, dy) {
    return Math.max(dx, dy);
  },

  heuristicAB: function(ax, ay, bx, by) {
    var dx = Math.abs(ax - bx);
    var dy = Math.abs(ay - by);
    switch (this.heuristic) {
      case Heuristic.Manhattan:
        return this.heuristicManhattan(dx, dy);
      case Heuristic.Euclidean:
        return this.heuristicEuclidean(dx, dy);
      case Heuristic.Octile:
        return this.heuristicOctile(dx, dy);
      case Heuristic.Chebyshev:
        return this.heuristicChebyshev(dx, dy);
    }
  },

  calculateCubesHeuristicAB: function(x, y, tx, ty) {
    var c = this.getCubeFromXY(x, y);
    c.H = Math.round(this.heuristicAB(x, y, tx, ty)) * MovingCost.Base;
  },

  heuristicToEnd: function(x, y) {
    return this.heuristicAB(x, y, this.end.x, this.end.y);
  },

  calculateCubesHeuristicToEnd: function() {
    for (var i = 0; i < this.size; i++) {
      var xy = this.getXYFromIndex(i)
      this.getCubeFromIndex(i).H = Math.round(this.heuristicToEnd(xy.x, xy.y)) * MovingCost.Base;
    }
  },

  initCubes: function() {
    var cubes = [];
    for (var i = 0; i < this.size; i++) {
      var c = new Cube();
      c.index = i;
      var XY = this.getXYFromIndex(i);
      c.x = XY.x;
      c.y = XY.y;
      cubes.push(c);
    }
    return cubes;
  },

  clearMatrix: function() {
    this.sequence = 1;
    for (var i = 0; i < this.size; i++) {
      var c = this.getCubeFromIndex(i);
      c.isPath = false;
      c.father = null;
      c.fatherDirection = null;

      c.isRedBorder = false;
      c.isGreenBorder = false;
      c.isBlueBorder = false;

      c.isOpen = false;
      c.isClosed = false;
      c.F = 0.0;
      c.G = 0.0;
      c.H = 0.0;
      c.isShowFGH = false;

      c.isVisited = false;
      c.sequence = 0.0;

      c.markedByBegin = false;
      c.markedByEnd = false;
    }
  },

  resetMatrix: function() {
    this.sequence = 1;

    this.cubes = this.initCubes();

    this.graph = this.buildGraph();

    this.begin = {
      x: 0,
      y: 0
    };
    this.end = {
      x: 9,
      y: 9
    };

    this.setBegin(this.begin.x, this.begin.y);
    this.setEnd(this.end.x, this.end.y);
  },

  resetGraph: function() {
    this.sequence = 1;

    this.clearMatrix();

    this.graph = this.buildGraph();
  },

  buildGraph: function() {
    var graph = [];
    // init graph
    for (var i = 0; i < this.size; i++) {
      var arr = [];
      for (var j = 0; j < this.size; j++) {
        arr.push(Number.POSITIVE_INFINITY);
      }
      graph.push(arr);
    }

    // init sides
    for (var x = 0; x < this.width; x++) {
      for (var y = 0; y < this.height; y++) {
        var currentNodeIndex = this.getIndexFromXY(x, y);
        var currentNodeCube = this.getCubeFromIndex(currentNodeIndex);
        for (var d = 0; d < DeltaLength; d++) {
          var dx = x + Delta[d].x;
          var dy = y + Delta[d].y;

          if (this.isInsideBoundary(dx, dy) && this.isDeltaCubeWalkable(x, y, d)) {
            var deltaNodeIndex = this.getIndexFromXY(dx, dy);
            var deltaNodeCube = this.getCubeFromIndex(deltaNodeIndex);
            var addedCorner = d % 2 == 0
              ? MovingCost.Turning
              : MovingCost.Stay;
            graph[currentNodeIndex][deltaNodeIndex] = deltaNodeCube.weight + addedCorner;
          }
        }
      }
    }

    return graph;
  },

  setCubeVisited: function(x, y) {
    var c = this.getCubeFromXY(x, y);
    c.isClosed = true;
    c.isGreenBorder = true;
    c.isVisited = true;
    c.sequence = this.sequence++;
  },

  setCubeExtended: function(x, y) {
    var c = this.getCubeFromXY(x, y);
    c.isOpen = true;
    c.isBlueBorder = true;
    c.isVisited = true;
    c.sequence = this.sequence++;
  },

  setCubePath: function(x, y) {
    var c = this.getCubeFromXY(x, y);
    c.isRedBorder = true;
    c.isPath = true;
    // c.sequence = this.sequence++;
  },

  setCubeFather: function(x, y, fi, fd) {
    var c = this.getCubeFromXY(x, y);
    c.father = fi;
    c.fatherDirection = fd;
  },

  setCubeG: function(x, y, G) {
    var c = this.getCubeFromXY(x, y);
    c.G = G;
    c.F = c.G + c.H;
    c.isShowFGH = true;
  },

  setAllPath: function() {
    var pathCube = this.getCubeFromXY(this.end.x, this.end.y);
    while (pathCube) {
      this.setCubePath(pathCube.x, pathCube.y);
      if (pathCube.father) {
        pathCube = this.getCubeFromIndex(pathCube.father);
      } else {
        pathCube = null;
      }
    }
  },

  setBiAllPath: function(ai, bi) {
    var pathCube = this.getCubeFromIndex(ai);
    while (pathCube) {
      this.setCubePath(pathCube.x, pathCube.y)
      pathCube = this.getCubeFromIndex(pathCube.father);
    }

    pathCube = this.getCubeFromIndex(bi);
    while (pathCube) {
      this.setCubePath(pathCube.x, pathCube.y)
      pathCube = this.getCubeFromIndex(pathCube.father);
    }
  }
});

export {Matrix};
