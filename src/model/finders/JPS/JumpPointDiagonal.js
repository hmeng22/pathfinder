import {PathFinder} from '../PathFinder'
import {CornerWalk, DeltaLength, Delta, DeltaReversedDirection} from '../Connstants'

function JumpPoint(matrix) {
  PathFinder.call(this, matrix);

  var _openlist = [];

  function getMinOpenlist(matrix) {
    var temp = _openlist[0];
    var l = _openlist.length;
    for (var i = 1; i < l; i++) {
      if (matrix.getCubeFromIndex(_openlist[0]).F > matrix.getCubeFromIndex(_openlist[i]).F) {
        temp = _openlist[i];
        _openlist[i] = _openlist[0];
        _openlist[0] = temp;
      }
    }
  }

  function fixDirection(dx, dy) {
    var angle = Math.atan2(dy, dx);
    var degrees = 180 * angle / Math.PI;
    var index = (360 + Math.round(degrees)) % 360 / 45;
    var fixedIndex = Math.abs(index - 13) % 8;
    return fixedIndex;
  }

  this.findPath = function() {
    _openlist = [];
    var _currentCube = null;

    if (this.isBeginEndSame()) {
      return true;
    }

    _openlist.push(this.matrix.getIndexFromXY(this.matrix.begin.x, this.matrix.begin.y));
    this.matrix.getCubeFromXY(this.matrix.begin.x, this.matrix.begin.y).isOpen = true;

    while (_openlist.length > 0) {
      getMinOpenlist(this.matrix);

      _currentCube = this.matrix.getCubeFromIndex(_openlist.shift());
      this.matrix.setCubeVisited(_currentCube.x, _currentCube.y);

      if (_currentCube.x == this.matrix.end.x && _currentCube.y == this.matrix.end.y) {
        this.recordAllPath();
        return true;
      }

      this.identifySuccessors(_currentCube);
    }

    return false;
  }

  this.identifySuccessors = function(cube) {
    var neighbours = this.findNeighbours(cube);
    for (var i = 0, l = neighbours.length; i < l; i++) {
      var neighbour = neighbours[i];

      this.recordSteps();

      var jumpPoint = this.jump(neighbour[0], neighbour[1], cube.x, cube.y);

      if (jumpPoint) {
        var jx = jumpPoint[0];
        var jy = jumpPoint[1];
        var jumpPointCube = this.matrix.getCubeFromXY(jx, jy);

        if (!jumpPointCube.isClosed) {
          // include distance, as parent may not be immediately adjacent:
          var dist = this.matrix.heuristicOctile(Math.abs(jx - cube.x), Math.abs(jy - cube.y));
          var jumpPointG = cube.G + dist;

          if (!jumpPointCube.isOpen || jumpPointG < jumpPointCube.G) {
            jumpPointCube.G = jumpPointG;
            jumpPointCube.H = jumpPointCube.H || this.matrix.heuristicToEnd(jx, jy);
            jumpPointCube.F = jumpPointCube.G + jumpPointCube.H;

            if (!jumpPointCube.isOpen) {
              _openlist.push(this.matrix.getIndexFromXY(jx, jy));
              jumpPointCube.isOpen = true;

              jumpPointCube.isGreenBorder = true;
              jumpPointCube.isVisited = true;
            } else {
              // update _openList
            }
          }

          this.recordSteps();
        }
      }

    }
  }

  this.findNeighbours = function(cube) {
    var neighbours = [];

    if (cube.father) {
      var cubeFather = this.matrix.getCubeFromIndex(cube.father);
      var x = cube.x;
      var y = cube.y;
      var fx = cubeFather.x;
      var fy = cubeFather.y;

      // get the normalized direction of travel
      var dx = (x - fx) / Math.max(Math.abs(x - fx), 1);
      var dy = (y - fy) / Math.max(Math.abs(y - fy), 1);

      if (dx !== 0 && dy !== 0) { // search diagonally
        if (this.matrix.isCubeWalkable(x, y + dy)) {
          neighbours.push([
            x, y + dy
          ]);
        }

        if (this.matrix.isCubeWalkable(x + dx, y)) {
          neighbours.push([
            x + dx,
            y
          ]);
        }

        // cornerWalk
        if (this.matrix.isCubeWalkable(x, y + dy) || this.matrix.isCubeWalkable(x + dx, y)) {
          neighbours.push([
            x + dx,
            y + dy
          ]);
        }
        if (!this.matrix.isCubeWalkable(x - dx, y) && this.matrix.isCubeWalkable(x, y + dy)) {
          neighbours.push([
            x - dx,
            y + dy
          ]);
        }
        if (!this.matrix.isCubeWalkable(x, y - dy) && this.matrix.isCubeWalkable(x + dx, y)) {
          neighbours.push([
            x + dx,
            y - dy
          ]);
        }
        // cornerWalk
      } else { // search horizontally/vertically
        if (dx === 0) {
          if (this.matrix.isCubeWalkable(x, y + dy)) {
            neighbours.push([
              x, y + dy
            ]);

            if (!this.matrix.isCubeWalkable(x + 1, y)) {
              neighbours.push([
                x + 1,
                y + dy
              ]);
            }
            if (!this.matrix.isCubeWalkable(x - 1, y)) {
              neighbours.push([
                x - 1,
                y + dy
              ]);
            }
          }
        } else {
          if (this.matrix.isCubeWalkable(x + dx, y)) {
            neighbours.push([
              x + dx,
              y
            ]);

            if (!this.matrix.isCubeWalkable(x, y + 1)) {
              neighbours.push([
                x + dx,
                y + 1
              ]);
            }
            if (!this.matrix.isCubeWalkable(x, y - 1)) {
              neighbours.push([
                x + dx,
                y - 1
              ]);
            }
          }
        }
      }
    } else { // return all
      for (var i = 0; i < DeltaLength; i++) {
        var deltaCubeX = cube.x + Delta[i].x;
        var deltaCubeY = cube.y + Delta[i].y;
        if (this.matrix.isDeltaCubeWalkable(cube.x, cube.y, i)) {
          var deltaCube = this.matrix.getCubeFromXY(deltaCubeX, deltaCubeY);
          if (!deltaCube.isClosed && !deltaCube.isOpen) {
            neighbours.push([deltaCubeX, deltaCubeY])
          }
        }
      }
    }

    return neighbours;
  }

  this.jump = function(x, y, fx, fy) {
    var dx = x - fx;
    var dy = y - fy;
    var fixedIndex = fixDirection(dx, dy);

    if (!this.matrix.isCubeWalkable(x, y)) {
      return null;
    }

    var cube = this.matrix.getCubeFromXY(x, y);
    if (!cube.isVisited) {
      cube.isBlueBorder = true;
      cube.isVisited = true;
      this.matrix.setCubeFather(x, y, this.matrix.getIndexFromXY(fx, fy), DeltaReversedDirection[fixedIndex]);
    }

    if (x == this.matrix.end.x && y == this.matrix.end.y) {
      return [x, y];
    }

    // check for forced neighbours
    if (dx !== 0 && dy !== 0) { // along the diagonal
      if ((this.matrix.isCubeWalkable(x - dx, y + dy) && !this.matrix.isCubeWalkable(x - dx, y)) || (this.matrix.isCubeWalkable(x + dx, y - dy) && !this.matrix.isCubeWalkable(x, y - dy))) {
        return [x, y];
      }
      // when moving diagonally, must check for vertical/horizontal jump points
      if (this.jump(x + dx, y, x, y) || this.jump(x, y + dy, x, y)) {
        return [x, y];
      }
    } else { // horizontally/vertically
      if (dx !== 0) { // moving along x
        if ((this.matrix.isCubeWalkable(x + dx, y + 1) && !this.matrix.isCubeWalkable(x, y + 1)) || (this.matrix.isCubeWalkable(x + dx, y - 1) && !this.matrix.isCubeWalkable(x, y - 1))) {
          return [x, y];
        }
      } else { // moving along y
        if ((this.matrix.isCubeWalkable(x + 1, y + dy) && !this.matrix.isCubeWalkable(x + 1, y)) || (this.matrix.isCubeWalkable(x - 1, y + dy) && !this.matrix.isCubeWalkable(x - 1, y))) {
          return [x, y];
        }
      }
    }

    // At Most One Obstacle
    if (this.matrix.isCubeWalkable(x + dx, y) || this.matrix.isCubeWalkable(x, y + dy)) {
      return this.jump(x + dx, y + dy, x, y);
    } else {
      return null;
    }
  }
}

JumpPoint.prototype = Object.assign(Object.create(PathFinder.prototype), {});

export {JumpPoint};
