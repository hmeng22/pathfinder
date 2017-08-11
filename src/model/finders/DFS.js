import {PathFinder} from '../PathFinder'
import {DeltaLength, Delta, DeltaReversedDirection} from '../Connstants'

function DFS(matrix) {
  PathFinder.call(this, matrix);

  var _visitlist = [];

  this.findPath = function() {
    _visitlist = [];
    var _currentCube = null;

    if (this.isBeginEndSame()) {
      return true;
    }

    _visitlist.push(this.matrix.getIndexFromXY(this.matrix.begin.x, this.matrix.begin.y));

    while (_visitlist.length > 0) {
      _currentCube = this.matrix.getCubeFromIndex(_visitlist.pop());
      this.matrix.setCubeVisited(_currentCube.x, _currentCube.y);

      for (var i = 0; i < DeltaLength; i++) {
        var deltaCubeX = _currentCube.x + Delta[i].x;
        var deltaCubeY = _currentCube.y + Delta[i].y;
        if (this.matrix.isDeltaCubeWalkable(_currentCube.x, _currentCube.y, i)) {
          var deltaCube = this.matrix.getCubeFromXY(deltaCubeX, deltaCubeY);
          if (!deltaCube.isVisited) {
            _visitlist.push(this.matrix.getIndexFromXY(deltaCubeX, deltaCubeY));

            this.matrix.setCubeExtended(deltaCubeX, deltaCubeY);

            this.matrix.setCubeFather(deltaCubeX, deltaCubeY, _currentCube.index, DeltaReversedDirection[i]);

            if (endCube.isPathFound()) {
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

DFS.prototype = Object.assign(Object.create(PathFinder.prototype), {});

export {DFS};
