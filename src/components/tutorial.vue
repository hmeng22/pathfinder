<template>
<el-row class="tutorial">

  <el-row class="tutorial-row">
    <el-col class="tutorial-col tutorial-left">
      <div class="tutorial-cube cube-begin">Begin</div>
    </el-col>
    <el-col class="tutorial-col tutorial-left">
      <div class="tutorial-cube cube-end">End</div>
    </el-col>
    <el-col class="tutorial-col tutorial-left">
      <div class="tutorial-cube cube-path">Path</div>
    </el-col>
    <el-col class="tutorial-col tutorial-left">
      <div class="tutorial-cube cube-obstacle">Obstacle</div>
    </el-col>

    <el-col class="tutorial-col tutorial-left">
      <div class="tutorial-cube">
        <div class="parent" style="transform: rotate(270deg);"></div>
        <div class="indicator indicator-visited">Visited</div>
        <div class="tutorial-cube-text">
          Parent
        </div>
      </div>
    </el-col>
    <el-col class="tutorial-col tutorial-left">
      <div class="tutorial-cube">
        <div class="parent" style="transform: rotate(270deg);"></div>
        <div class="indicator indicator-path">Path</div>
        <div class="tutorial-cube-text">
          Parent
        </div>
      </div>
    </el-col>

    <el-col class="tutorial-col tutorial-left">
      <div class="tutorial-cube cube-path">
        <div class="H line-height-font-size">10(H)</div>
        <div class="indicator indicator-visited"></div>
        <div class="tutorial-cube-text">
          Heuristic
        </div>
      </div>
    </el-col>
    <el-col class="tutorial-col tutorial-left">
      <div class="tutorial-cube cube-path">
        <div class="G line-height-font-size">20(G)</div>
        <div class="indicator indicator-visited"></div>
        <div class="tutorial-cube-text">
          Moving Cost
        </div>
      </div>
    </el-col>
    <el-col class="tutorial-col tutorial-left">
      <div class="tutorial-cube cube-path">
        <div class="F line-height-font-size">30(F)</div>
        <div class="indicator indicator-visited"></div>
        <div class="tutorial-cube-text">
          Weight
        </div>
      </div>
    </el-col>
    <el-col class="tutorial-col tutorial-left">
      <div class="tutorial-cube cube-path">
        <div class="S line-height-font-size">10</div>
        <div class="indicator indicator-visited"></div>
        <div class="tutorial-cube-text">
          Visiting Index
        </div>
      </div>
    </el-col>
  </el-row>
</el-row>
</template>

<script>
import cube from './cube'

export default {
  data() {
    return {
      start: {
        type: 'begin'
      }
    }
  },

  components: {
    cube
  }

}
</script>

<style lang="less" scoped>
@import "../assets/app.less";

.tutorial {
    width: @martix-width;
    border: @martix-border-width solid @martix-border-color;
}

.tutorial-row {
    height: @matrix-cube-width-height + 2px;
    line-height: @matrix-cube-width-height;
    background-color: @tutorial-row-background;
    border: 1px solid @martix-border-color;
}

.tutorial-col {
    height: 100%;
}

.tutorial-left {
    width: @matrix-cube-width-height;
    background-color: white;
    text-align: center;
}

.tutorial-right {
    width: calc(~"50%" - @tutorial-row-height);
    text-align: left;
}

.tutorial-cube {
    position: relative;
    width: @matrix-cube-width-height;
    height: @matrix-cube-width-height;
    font-size: @tutorial-font-size;
}

.line-height-font-size {
    line-height: @tutorial-font-size;
}

.tutorial-cube-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    line-height: @tutorial-font-size;
}
</style>
