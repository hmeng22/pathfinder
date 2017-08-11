import {PathFinder} from '../PathFinder'
import {MovingCost, DeltaLength, Delta, DeltaReversedDirection} from '../Connstants'

function BiAStarHeap(matrix) {
  PathFinder.call(this, matrix);

  var _beginOpenList = [];
  var _endOpenList = [];

  function popBinaryHeap(openlist, matrix) {
    if (openlist.length == 1)
      return;
    openlist[1] = openlist.pop();
    var l = openlist.length;
    var v = 1;
    var u;
    while (true) {
      u = v;
      if (2 * u + 1 <= l) { // has 2 children : choose the lowest F value from the father cube and 2 children cubes
        if (matrix.getCubeFromIndex(openlist[u]).F >= matrix.getCubeFromIndex(openlist[2 * u]).F) {
          v = 2 * u;
        }
        if (matrix.getCubeFromIndex(openlist[v]).F >= matrix.getCubeFromIndex(openlist[2 * u + 1]).F) {
          v = 2 * u + 1;
        }
      } else {
        if (2 * u <= l) { // has 1 child
          if (matrix.getCubeFromIndex(openlist[u]).F >= matrix.getCubeFromIndex(openlist[2 * u]).F) {
            v = 2 * u;
          }
        }
      }

      var temp;
      if (u != v) {
        temp = openlist[u];
        openlist[u] = openlist[v];
        openlist[v] = temp;
      } else {
        break;
      }
    }
  }

  function sortBinaryHeap(openlist, matrix) {
    var temp;
    var l = openlist.length - 1;
    while (l != 1) {
      var l2 = parseInt(l / 2);
      if (matrix.getCubeFromIndex(openlist[l]).F < matrix.getCubeFromIndex(openlist[l2]).F) {
        temp = openlist[l2];
        openlist[l2] = openlist[l];
        openlist[l] = temp;
        l = l2;
      } else {
        break;
      }
    }
  }

  this.findPath = function() {
    _beginOpenList = [];
    _endOpenList = [];
    var _currentCube = null;

    if (this.isBeginEndSame()) {
      return true;
    }

    _beginOpenList.push(0);
    _beginOpenList.push(this.matrix.getIndexFromXY(this.matrix.begin.x, this.matrix.begin.y));
    _endOpenList.push(0);
    _endOpenList.push(this.matrix.getIndexFromXY(this.matrix.end.x, this.matrix.end.y));

    while (_beginOpenList.length > 0 && _endOpenList.length > 0) {
      _currentCube = this.matrix.getCubeFromIndex(_beginOpenList[1]);
      this.matrix.setCubeVisited(_currentCube.x, _currentCube.y);

      popBinaryHeap(_beginOpenList, this.matrix);

      for (var i = 0; i < DeltaLength; i++) {
        var deltaCubeX = _currentCube.x + Delta[i].x;
        var deltaCubeY = _currentCube.y + Delta[i].y;
        if (this.matrix.isDeltaCubeWalkable(_currentCube.x, _currentCube.y, i)) {
          var deltaCube = this.matrix.getCubeFromXY(deltaCubeX, deltaCubeY);
          if (!deltaCube.isClosed) {

            if (deltaCube.markedByEnd) {
              this.recordBiAllPath(_currentCube.index, deltaCube.index);
              return true;
            }

            this.matrix.calculateCubesHeuristicAB(deltaCubeX, deltaCubeY, this.matrix.end.x, this.matrix.end.y);
            var tempG = i % 2 == 0
              ? _currentCube.G + MovingCost.Diagonal
              : _currentCube.G + MovingCost.Orthogonal;

            if ((!deltaCube.markedByBegin && !deltaCube.markedByEnd) || tempG < deltaCube.G) {
              this.matrix.setCubeG(deltaCubeX, deltaCubeY, tempG);
              this.matrix.setCubeFather(deltaCubeX, deltaCubeY, _currentCube.index, DeltaReversedDirection[i]);

              if (!deltaCube.markedByBegin && !deltaCube.markedByEnd) {
                _beginOpenList.push(this.matrix.getIndexFromXY(deltaCubeX, deltaCubeY));
                deltaCube.markedByBegin = true;
              }
            }

            this.matrix.setCubeExtended(deltaCubeX, deltaCubeY);

            sortBinaryHeap(_beginOpenList, this.matrix);

            this.recordSteps();
          }
        }
      }

      _currentCube = this.matrix.getCubeFromIndex(_endOpenList[1]);
      this.matrix.setCubeVisited(_currentCube.x, _currentCube.y);

      popBinaryHeap(_endOpenList, this.matrix);

      for (var i = 0; i < DeltaLength; i++) {
        var deltaCubeX = _currentCube.x + Delta[i].x;
        var deltaCubeY = _currentCube.y + Delta[i].y;
        if (this.matrix.isDeltaCubeWalkable(_currentCube.x, _currentCube.y, i)) {
          var deltaCube = this.matrix.getCubeFromXY(deltaCubeX, deltaCubeY);
          if (!deltaCube.isClosed) {

            if (deltaCube.markedByBegin) {
              this.recordBiAllPath(_currentCube.index, deltaCube.index);
              return true;
            }

            this.matrix.calculateCubesHeuristicAB(deltaCubeX, deltaCubeY, this.matrix.begin.x, this.matrix.begin.y);
            var tempG = i % 2 == 0
              ? _currentCube.G + MovingCost.Diagonal
              : _currentCube.G + MovingCost.Orthogonal;

            if ((!deltaCube.markedByBegin && !deltaCube.markedByEnd) || tempG < deltaCube.G) {
              this.matrix.setCubeG(deltaCubeX, deltaCubeY, tempG);
              this.matrix.setCubeFather(deltaCubeX, deltaCubeY, _currentCube.index, DeltaReversedDirection[i]);

              if (!deltaCube.markedByBegin && !deltaCube.markedByEnd) {
                _endOpenList.push(this.matrix.getIndexFromXY(deltaCubeX, deltaCubeY));
                deltaCube.markedByEnd = true;
              }
            }

            this.matrix.setCubeExtended(deltaCubeX, deltaCubeY);

            this.recordSteps();
          }
        }
      }
    }

    return false;
  }
}

BiAStarHeap.prototype = Object.assign(Object.create(PathFinder.prototype), {});

export {BiAStarHeap};
