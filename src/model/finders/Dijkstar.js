import {PathFinder} from '../PathFinder'
import {DeltaLength, Delta, DeltaReversedDirection} from '../Connstants'

function Dijkstar(matrix) {
  PathFinder.call(this, matrix);

  this.findPath = function() {
    var nodesSize = this.matrix.size;
    var beginNode = this.matrix.getIndexFromXY(this.matrix.begin.x, this.matrix.begin.y);
    var endNode = this.matrix.getIndexFromXY(this.matrix.end.x, this.matrix.end.y);

    // build distance & previous
    var distance = [];
    var previous = [];
    var isVisited = [];
    for (var i = 0; i < nodesSize; i++) {
      distance[i] = Number.POSITIVE_INFINITY;
      previous[i] = -1;
      isVisited[i] = false;
    }
    distance[beginNode] = 0;

    var shortestNode = null;
    var shortestNodeCube = null;
    var deltaCube = null;

    // 2. pick the shortest node from dist[], and put it into Set S.
    // Once Set S contains all nodes in V, dist[] will record all shortest path value from source node to other nodes
    for (var i = 0; i < nodesSize; i++) {
      var tempSide = Number.POSITIVE_INFINITY;

      // find the shortest dist[j] value which is unvisited
      for (var j = 0; j < nodesSize; j++) {
        if (!isVisited[j] && distance[j] < tempSide) {
          shortestNode = j;
          tempSide = distance[j];
        }
      }
      // visit the shortest node
      isVisited[shortestNode] = true;
      shortestNodeCube = this.matrix.getCubeFromIndex(shortestNode);
      shortestNodeCube.isGreenBorder = true;
      shortestNodeCube.isVisited = true;
      shortestNodeCube.sequence = this.sequence++;
      shortestNodeCube.F = tempSide;
      shortestNodeCube.isShowFGH = true;

      // update distance values
      for (var j = 0; j < nodesSize; j++) {
        if (!isVisited[j] && this.matrix.graph[shortestNode][j] < Number.POSITIVE_INFINITY) {
          var newDistance = distance[shortestNode] + this.matrix.graph[shortestNode][j];
          if (newDistance <= distance[j]) {
            distance[j] = newDistance;
            previous[j] = shortestNode;

            deltaCube = this.matrix.getCubeFromIndex(j);
            deltaCube.isBlueBorder = true;
            deltaCube.sequence = this.sequence++;
            deltaCube.F = newDistance;
            deltaCube.isShowFGH = true;

            if (j == endNode) {
              var previousPathNode = this.matrix.getCubeFromIndex(endNode);
              var path = previous[endNode];
              var pathNode = null;
              while (path != -1) {
                pathNode = this.matrix.getCubeFromIndex(path);
                previousPathNode.father = path;
                previousPathNode = pathNode;
                path = previous[path];
              }

              this.recordAllPath();
              return true;
            }
          }
        }
      }

      this.recordSteps();
    }

    if (!isVisited[endNode]) {
      return false;
    }
  }
}

Dijkstar.prototype = Object.assign(Object.create(PathFinder.prototype), {});

export {Dijkstar}
