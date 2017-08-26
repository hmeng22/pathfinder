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
    var next = [];
    for (var i = 0; i < nodesSize; i++) {
      var arr = [];
      var brr = [];
      for (var j = 0; j < nodesSize; j++) {
        arr.push(Number.POSITIVE_INFINITY);
        brr.push(-1);
      }
      distance.push(arr);
      next.push(brr);
    }
    for (var i = 0; i < nodesSize; i++) {
      for (var j = 0; j < nodesSize; j++) {
        distance[i][j] = this.matrix.graph[i][j];
        next[i][j] = j;
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
                next[i][j] = next[i][k];

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

    if (next[beginNode][endNode] != -1) {
      var pathNodesIndexes = [];

      var u = beginNode;
      var v = endNode;
      while (u != v) {
        u = next[u][v];
        pathNodesIndexes.push(u);
      }

      var pathNode = null;
      for (var i = pathNodesIndexes.length - 1; i > 0; i--) {
        pathNode = this.matrix.getCubeFromIndex(pathNodesIndexes[i]);
        pathNode.father = pathNodesIndexes[i - 1];
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
