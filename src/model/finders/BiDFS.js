import {PathFinder} from '../PathFinder'
import {DeltaLength, Delta, DeltaReversedDirection} from '../Connstants'

function BiDFS(matrix) {
  PathFinder.call(this, matrix);

  var _beginVisitList = [];
  var _endVisitList = [];

  this.findPath = function() {
    _beginVisitList = [];
    _endVisitList = [];
    var _currentCube = null;

    if (this.isBeginEndSame()) {
      return true;
    }

    _beginVisitList.push(this.matrix.getIndexFromXY(this.matrix.begin.x, this.matrix.begin.y));
    _endVisitList.push(this.matrix.getIndexFromXY(this.matrix.end.x, this.matrix.end.y));

    while (_beginVisitList.length > 0 && _endVisitList.length > 0) {
      _currentCube = this.matrix.getCubeFromIndex(_beginVisitList.pop());
      this.matrix.setCubeVisited(_currentCube.x, _currentCube.y);

      for (var i = 0; i < DeltaLength; i++) {
        var deltaCubeX = _currentCube.x + Delta[i].x;
        var deltaCubeY = _currentCube.y + Delta[i].y;
        if (this.matrix.isDeltaCubeWalkable(_currentCube.x, _currentCube.y, i)) {
          var deltaCube = this.matrix.getCubeFromXY(deltaCubeX, deltaCubeY);

          if (deltaCube.markedByEnd) {
            this.recordBiAllPath(_currentCube.index, deltaCube.index);
            return true;
          }

          if (!deltaCube.isVisited) {
            _beginVisitList.push(this.matrix.getIndexFromXY(deltaCubeX, deltaCubeY));
            deltaCube.markedByBegin = true;
            this.matrix.setCubeFather(deltaCubeX, deltaCubeY, _currentCube.index, DeltaReversedDirection[i]);

            this.matrix.setCubeExtended(deltaCubeX, deltaCubeY);

            this.recordSteps();
          }
        }
      }

      _currentCube = this.matrix.getCubeFromIndex(_endVisitList.pop());
      this.matrix.setCubeVisited(_currentCube.x, _currentCube.y);

      for (var i = 0; i < DeltaLength; i++) {
        var deltaCubeX = _currentCube.x + Delta[i].x;
        var deltaCubeY = _currentCube.y + Delta[i].y;
        if (this.matrix.isDeltaCubeWalkable(_currentCube.x, _currentCube.y, i)) {
          var deltaCube = this.matrix.getCubeFromXY(deltaCubeX, deltaCubeY);

          if (deltaCube.markedByBegin) {
            this.recordBiAllPath(_currentCube.index, deltaCube.index);
            return true;
          }

          if (!deltaCube.isVisited) {
            _endVisitList.push(this.matrix.getIndexFromXY(deltaCubeX, deltaCubeY));
            deltaCube.markedByEnd = true;
            this.matrix.setCubeFather(deltaCubeX, deltaCubeY, _currentCube.index, DeltaReversedDirection[i]);

            this.matrix.setCubeExtended(deltaCubeX, deltaCubeY);

            this.recordSteps();
          }
        }
      }
    }

    return false;
  }
}

BiDFS.prototype = Object.assign(Object.create(PathFinder.prototype), {});

export {BiDFS};
