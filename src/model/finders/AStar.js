import {PathFinder} from '../PathFinder'
import {MovingCost, DeltaLength, Delta, DeltaReversedDirection} from '../Connstants'

function AStar(matrix) {
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

  this.findPath = function() {
    _openlist = [];
    var _currentCube = null;

    if (this.isBeginEndSame()) {
      return true;
    }

    this.matrix.calculateCubesHeuristicToEnd();

    _openlist.push(this.matrix.getIndexFromXY(this.matrix.begin.x, this.matrix.begin.y));

    while (_openlist.length > 0) {
      getMinOpenlist(this.matrix);

      _currentCube = this.matrix.getCubeFromIndex(_openlist.shift());
      this.matrix.setCubeVisited(_currentCube.x, _currentCube.y);

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

            this.recordSteps();
          }
        }
      }
    }

    return false;
  }
}

AStar.prototype = Object.assign(Object.create(PathFinder.prototype), {});

export {AStar};
