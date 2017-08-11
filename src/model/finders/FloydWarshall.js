import {PathFinder} from '../PathFinder'
import {DeltaLength, Delta, DeltaReversedDirection} from '../Connstants'

function FloydWarshall(matrix) {
  PathFinder.call(this, matrix);

  this.findPath = function() {
    var nodesSize = this.matrix.size;
    var beginNode = this.matrix.getIndexFromXY(this.matrix.begin.x, this.matrix.begin.y);
    var endNode = this.matrix.getIndexFromXY(this.matrix.end.x, this.matrix.end.y);

    // build distance
    var distance = [];
    var previous = [];
    for (var i = 0; i < nodesSize; i++) {
      var arr = [];
      var brr = [];
      for (var j = 0; j < nodesSize; j++) {
        arr.push(Number.POSITIVE_INFINITY);
        brr.push(-1)
      }
      distance.push(arr);
      previous.push(brr);
    }
    for (var i = 0; i < nodesSize; i++) {
      for (var j = 0; j < nodesSize; j++) {
        distance[i][j] = this.matrix.graph[i][j];
      }
    }

    var throughNodeCube = null;
    var ANodeCube = null;
    var BNodeCube = null;
    for (var k = 0; k < nodesSize; k++) {
      throughNodeCube = this.matrix.getCubeFromIndex(k);
      if (!throughNodeCube.isObstacle) {
        //
        throughNodeCube.isGreenBorder = true;
        throughNodeCube.isVisited = true;
        throughNodeCube.sequence = this.sequence++;
        //

        for (var i = 0; i < nodesSize; i++) {
          for (var j = 0; j < nodesSize; j++) {
            ANodeCube = this.matrix.getCubeFromIndex(i);
            BNodeCube = this.matrix.getCubeFromIndex(j);
            if (!ANodeCube.isObstacle && !BNodeCube.isObstacle) {
              if (distance[i][j] > distance[i][k] + distance[k][j]) {
                distance[i][j] = distance[i][k] + distance[k][j];
                previous[i][j] = k;

                //
                ANodeCube.sequence = this.sequence++;
                BNodeCube.sequence = this.sequence++;
                //
              }
            }
          }
        }
      }
    }

    var previousPathNode = this.matrix.getCubeFromIndex(endNode);
    var path = previous[beginNode][endNode];
    if (path != -1) {
      var pathNode = null;
      while (path != -1) {
        pathNode = this.matrix.getCubeFromIndex(path);
        previousPathNode.father = path;
        previousPathNode = pathNode;
        path = previous[beginNode][path];
      }

      this.recordAllPath();
      return true;
    } else {
      return false;
    }
  }
}

FloydWarshall.prototype = Object.assign(Object.create(PathFinder.prototype), {});

export {FloydWarshall}
