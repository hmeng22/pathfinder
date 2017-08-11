<template>
<div class="cube" :class='[cubeType, borderType]' @mousedown='cubeMouseDown' @mouseup='cubeMouseUp' @mouseenter='cubeMouseEnter' :style="{ 'grid-row' : gridR, 'grid-column': gridC}">
  <div v-show='cube.isShowFGH' class="H">{{cube.H}}</div>
  <div v-show='cube.isShowFGH' class="G">{{cube.G}}</div>
  <div v-show='cube.isShowFGH' class="F">{{cube.F}}</div>
  <div v-show='cube.sequence != 0' class="S">{{cube.sequence}}</div>
  <div v-show='cube.fatherDirection' class="parent" :style="{ transform : direction }"></div>
  <div v-show='cube.isVisited' class="indicator" :class='indicatorType'></div>
</div>
</template>

<script>
import {
  mapActions,
  mapGetters
} from 'vuex'

export default {

  props: [
    'index'
  ],

  computed: {
    ...mapGetters([
      'matrix',
      'lastClickedCubeIndex',
      'selectedCubeType'
    ]),

    cubeIndex() {
      return this.index - 1;
    },

    cube() {
      return this.matrix.getCubeFromIndex(this.cubeIndex);
    },

    gridR() {
      return parseInt((this.cubeIndex) / 10) + 1;
    },

    gridC() {
      return parseInt((this.cubeIndex) % 10) + 1;
    },

    direction() {
      return 'rotate(' + 45 * (this.cube.fatherDirection + 1) + 'deg)';
    },

    cubeType() {
      return 'cube-' + this.cube.type;
    },

    borderType() {
      if (this.cubeIndex == this.lastClickedCubeIndex) {
        return 'cube-border-clicked';
      } else if (this.cube.isRedBorder) {
        return 'cube-border-red';
      } else if (this.cube.isGreenBorder) {
        return 'cube-border-green';
      } else if (this.cube.isBlueBorder) {
        return 'cube-border-blue';
      } else if (this.cube.type == 'obstacle') {
        return 'cube-border-obstacle-color';
      } else {
        return 'cube-border-normal';
      }
    },

    indicatorType() {
      if (this.cube.isPath) {
        return 'indicator-path'
      } else if (this.cube.isVisited) {
        return 'indicator-visited'
      }
    }
  },

  methods: {
    ...mapActions([
      'UPDATE_LAST_CLICKED_CUBE_INDEX',
      'UPDATE_SELECTED_CUBE_TYPE'
    ]),

    cubeMouseDown() {
      var cubeXY = this.matrix.getXYFromIndex(this.cubeIndex);
      if (this.cube.type == 'begin' || this.cube.type == 'end') {
        console.log(this.cube.type)
        this.$store.commit('UPDATE_SELECTED_CUBE_TYPE', this.cube.type);
        this.$store.commit('UPDATE_LAST_CLICKED_CUBE_INDEX', this.cubeIndex);
      } else {
        if (this.cube.type == 'path') {
          this.matrix.setTypeObstacle(cubeXY.x, cubeXY.y);
          this.$store.commit('UPDATE_SELECTED_CUBE_TYPE', 'obstacle');
        } else if (this.cube.type == 'obstacle') {
          this.matrix.setTypePath(cubeXY.x, cubeXY.y);
          this.$store.commit('UPDATE_SELECTED_CUBE_TYPE', 'path');
        }
      }
    },

    cubeMouseUp() {
      this.$store.commit('UPDATE_SELECTED_CUBE_TYPE', '');
    },

    cubeMouseEnter() {
      var cubeXY = this.matrix.getXYFromIndex(this.cubeIndex);
      if (this.selectedCubeType) {
        if (this.selectedCubeType != 'begin' && this.selectedCubeType != 'end') {
          if (this.selectedCubeType == 'path') {
            this.matrix.setTypePath(cubeXY.x, cubeXY.y);
          } else if (this.selectedCubeType == 'obstacle') {
            this.matrix.setTypeObstacle(cubeXY.x, cubeXY.y);
          }
          this.$store.commit('UPDATE_LAST_CLICKED_CUBE_INDEX', this.cubeIndex);
        } else {
          if (this.cube.type != 'begin' && this.cube.type != 'end') {
            if (this.selectedCubeType == 'begin') {
              this.matrix.setBegin(cubeXY.x, cubeXY.y);
            } else if (this.selectedCubeType == 'end') {
              this.matrix.setEnd(cubeXY.x, cubeXY.y);
            }
            
            var lasyXY = this.matrix.getXYFromIndex(this.lastClickedCubeIndex);
            this.matrix.setTypePath(lasyXY.x, lasyXY.y);
            this.$store.commit('UPDATE_LAST_CLICKED_CUBE_INDEX', this.cubeIndex);
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "../assets/app.less";

.cube {
    position: relative;
    border: @cube-border-width solid;
}

.cube-obstacle {
    background-color: @cube-obstacle;
}

.cube-path {
    background-color: @cube-path;
}

.cube-begin {
    background-color: @cube-begin;
}

.cube-end {
    background-color: @cube-end;
}

.cube-border-normal {
    border-color: @cube-border-normal-color;
}

.cube-border-obstacle-color {
    border-color: @cube-border-obstacle-color;
}

.cube-border-red {
    border-color: @cube-border-red-color;
}

.cube-border-green {
    border-color: @cube-border-green-color;
}

.cube-border-blue {
    border-color: @cube-border-blue-color;
}

.cube-border-clicked {
    border-color: @cube-border-clicked-color;
}

.indicator {
    position: absolute;
    width: @cube-indicator-radius;
    height: @cube-indicator-radius;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: @cube-indicator-radius;
}

.indicator-visited {
    background-color: @cube-indicator-visited-color;
}

.indicator-path {
    background-color: @cube-indicator-path-color;
}

.parent {
    position: absolute;
    width: @cube-parent-length;
    top: calc(50% - @cube-parent-width);
    left: 50%;
    border-bottom: @cube-parent-width solid @cube-parent-color;
    transform-origin: 0 50%;
}

.H {
    position: absolute;
    top: 2%;
    left: 2%;
    user-select: none;
    color: @cube-H-color;
    font-size: @cube-font-size;
}

.G {
    position: absolute;
    top: 2%;
    right: 2%;
    user-select: none;
    color: @cube-G-color;
    font-size: @cube-font-size;
}

.F {
    position: absolute;
    bottom: 2%;
    left: 2%;
    user-select: none;
    color: @cube-F-color;
    font-size: @cube-font-size;
}

.S {
    position: absolute;
    bottom: 2%;
    right: 2%;
    user-select: none;
    color: @cube-S-color;
    font-size: @cube-font-size;
}
</style>
