import {Matrix} from './Matrix'

var pathfinderId = 0;

function PathFinder(matrix) {
  Object.defineProperty(this, 'id', {
    value: pathfinderId++
  });

  this.matrix = matrix || {};

  this.isHistoryReady = false;
  this.history = [];

  this.history.push(JSON.parse(JSON.stringify(this.matrix)));

  this.stepIndex = 0;
}

Object.assign(PathFinder.prototype, {
  isBeginEndSame: function() {
    return this.matrix.begin.x == this.matrix.end.x && this.matrix.begin.y == this.matrix.end.y;
  },

  recordSteps: function() {
    this.history.push(JSON.parse(JSON.stringify(this.matrix)));
  },

  recordAllPath: function() {
    this.matrix.setAllPath();
    this.recordSteps();
    this.setIsHistoryReady(true);
  },

  recordBiAllPath: function(ai, bi) {
    this.matrix.setBiAllPath(ai, bi);
    this.recordSteps();
    this.setIsHistoryReady(true);
  },

  getFirstResult: function() {
    this.stepIndex = 1;
    return this.getCurrentMatrix();
  },

  getFinalResult: function() {
    this.stepIndex = this.history.length - 1;
    return this.getCurrentMatrix();
  },

  getCurrentMatrix: function() {
    var matrixBase = this.history[this.stepIndex];
    return Object.setPrototypeOf(matrixBase, Matrix.prototype);
  },

  isNextStepAvaiable: function() {
    return this.stepIndex < this.history.length - 1;
  },

  getNextStepMatrix: function() {
    if (this.isNextStepAvaiable()) {
      this.stepIndex++;
      return this.getCurrentMatrix();
    }
  },

  isPreviousStepAvailable: function() {
    return this.stepIndex > 0;
  },

  getPreviousStepMatrix: function() {
    if (this.isPreviousStepAvailable()) {
      this.stepIndex--;
      return this.getCurrentMatrix();
    }
  },

  setIsHistoryReady: function(f) {
    this.isHistoryReady = f;
  },

  isPathFound: function() {
    var endCube = this.matrix.getCubeFromXY(this.matrix.end.x, this.matrix.end.y);
    return endCube.isOpen || endCube.isVisited;
  },

  resetFinder: function(matrix) {
    this.matrix = matrix;
    this.setIsHistoryReady(false);
    this.history = [];
    this.history.push(JSON.parse(JSON.stringify(this.matrix)));
    this.stepIndex = 0;
  }
});

export {PathFinder};
