import {PathFinder} from '../PathFinder'
import {MovingCost, DeltaLength, Delta, DeltaReversedDirection} from '../Connstants'

function AStarHeap(matrix) {
  PathFinder.call(this, matrix);

  var _openlist = [];

  function popBinaryHeap(matrix) {
    if (_openlist.length == 1)
      return;
    _openlist[1] = _openlist.pop();
    var l = _openlist.length;
    var v = 1;
    var u;
    while (true) {
      u = v;
      if (2 * u + 1 <= l) { // has 2 children : choose the lowest F value from the father cube and 2 children cubes
        if (matrix.getCubeFromIndex(_openlist[u]).F >= matrix.getCubeFromIndex(_openlist[2 * u]).F) {
          v = 2 * u;
        }
        if (matrix.getCubeFromIndex(_openlist[v]).F >= matrix.getCubeFromIndex(_openlist[2 * u + 1]).F) {
          v = 2 * u + 1;
        }
      } else {
        if (2 * u <= l) { // has 1 child
          if (matrix.getCubeFromIndex(_openlist[u]).F >= matrix.getCubeFromIndex(_openlist[2 * u]).F) {
            v = 2 * u;
          }
        }
      }

      var temp;
      if (u != v) {
        temp = _openlist[u];
        _openlist[u] = _openlist[v];
        _openlist[v] = temp;
      } else {
        break;
      }
    }
  }

  function sortBinaryHeap(matrix) {
    var temp;
    var l = _openlist.length - 1;
    while (l != 1) {
      var l2 = parseInt(l / 2);
      if (matrix.getCubeFromIndex(_openlist[l]).F <= matrix.getCubeFromIndex(_openlist[l2]).F) {
        temp = _openlist[l2];
        _openlist[l2] = _openlist[l];
        _openlist[l] = temp;
        l = l2;
      } else {
        break;
      }
    }
  }

  this.findPath = function() {
    _openlist = [];
    var _currentCube = null;

    if (this.isBeginEndSame()) {
      return true;
    }

    this.matrix.calculateCubesHeuristicToEnd();

    _openlist.push(0);
    _openlist.push(this.matrix.getIndexFromXY(this.matrix.begin.x, this.matrix.begin.y));

    while (_openlist.length > 1) {
      _currentCube = this.matrix.getCubeFromIndex(_openlist[1]);
      this.matrix.setCubeVisited(_currentCube.x, _currentCube.y);

      popBinaryHeap(this.matrix);

      for (var i = 0; i < DeltaLength; i++) {
        var deltaCubeX = _currentCube.x + Delta[i].x;
        var deltaCubeY = _currentCube.y + Delta[i].y;
        if (this.matrix.isDeltaCubeWalkable(_currentCube.x, _currentCube.y, i)) {
          var deltaCube = this.matrix.getCubeFromXY(deltaCubeX, deltaCubeY);
          if (!deltaCube.isClosed) {
            var tempG = i % 2 == 0
              ? _currentCube.G + MovingCost.Diagonal
              : _currentCube.G + MovingCost.Orthogonal;

            if (!deltaCube.isOpen) {
              _openlist.push(this.matrix.getIndexFromXY(deltaCubeX, deltaCubeY));
              this.matrix.setCubeG(deltaCubeX, deltaCubeY, tempG);
              this.matrix.setCubeFather(deltaCubeX, deltaCubeY, _currentCube.index, DeltaReversedDirection[i]);
              this.matrix.setCubeExtended(deltaCubeX, deltaCubeY);
            } else {
              if (tempG < deltaCube.G) {
                this.matrix.setCubeG(deltaCubeX, deltaCubeY, tempG);
                this.matrix.setCubeFather(deltaCubeX, deltaCubeY, _currentCube.index, DeltaReversedDirection[i]);
              }
            }

            if (this.isPathFound()) {
              this.recordAllPath();
              return true;
            }

            sortBinaryHeap(this.matrix);

            this.recordSteps();
          }
        }
      }
    }

    return false;
  }
}

AStarHeap.prototype = Object.assign(Object.create(PathFinder.prototype), {});

export {AStarHeap};
