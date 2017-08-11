import {PathFinder} from '../PathFinder'
import {MovingCost, DeltaLength, Delta, DeltaReversedDirection} from '../Connstants'

function BiAStar(matrix) {
  PathFinder.call(this, matrix);

  var _beginOpenList = [];
  var _endOpenList = [];

  function getMinOpenlist(openlist, matrix) {
    var temp = openlist[0];
    var l = openlist.length;
    for (var i = 1; i < l; i++) {
      if (matrix.getCubeFromIndex(openlist[0]).F > matrix.getCubeFromIndex(openlist[i]).F) {
        temp = openlist[i];
        openlist[i] = openlist[0];
        openlist[0] = temp;
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

    _beginOpenList.push(this.matrix.getIndexFromXY(this.matrix.begin.x, this.matrix.begin.y));
    _endOpenList.push(this.matrix.getIndexFromXY(this.matrix.end.x, this.matrix.end.y));

    while (_beginOpenList.length > 0 && _endOpenList.length > 0) {
      getMinOpenlist(_beginOpenList, this.matrix);

      _currentCube = this.matrix.getCubeFromIndex(_beginOpenList.shift());
      this.matrix.setCubeVisited(_currentCube.x, _currentCube.y);

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

            this.recordSteps();
          }
        }
      }

      getMinOpenlist(_endOpenList, this.matrix);

      _currentCube = this.matrix.getCubeFromIndex(_endOpenList.shift());
      this.matrix.setCubeVisited(_currentCube.x, _currentCube.y);

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

BiAStar.prototype = Object.assign(Object.create(PathFinder.prototype), {});

export {BiAStar};
