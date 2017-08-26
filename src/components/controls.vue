<template>
<el-row class="controls">
  <el-row>
    <el-col :span='8'>
      <el-button @click='run'>{{ $t('run') }}</el-button>
    </el-col>
    <el-col :span='8'>
      <el-button @click='clear'>{{ $t('clear') }}</el-button>
    </el-col>
    <el-col :span='8'>
      <el-button @click='reset'>{{ $t('reset') }}</el-button>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span='12'>
      <el-button @click='previous' :disabled='isPreviousButton'>{{ $t('previous') }}</el-button>
    </el-col>
    <el-col :span='12'>
      <el-button @click='next' :disabled='isNextButton'>{{ $t('next') }}</el-button>
    </el-col>
  </el-row>
  <el-row>
    <el-select v-model="finder" placeholder="Select" @change='selectFinder'>
      <el-option v-for="f in finders" :key="f.value" :label="f.label" :value="f.value">
      </el-option>
    </el-select>
  </el-row>
  <el-row>
    <el-radio-group v-model="cornerWalk" @change='selectCornerWalk'>
      <el-radio-button label="Orthogonal"></el-radio-button>
      <el-radio-button label="Diagonal"></el-radio-button>
    </el-radio-group>
  </el-row>
  <el-row>
    <el-radio-group v-model="heuristic" @change='selectHeuristic'>
      <el-radio-button label="Manhattan"></el-radio-button>
      <el-radio-button label="Euclidean"></el-radio-button>
      <el-radio-button label="Octile"></el-radio-button>
      <el-radio-button label="Chebyshev"></el-radio-button>
    </el-radio-group>
  </el-row>
</el-row>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex'

import {
  Matrix
} from '../model/Matrix'
import {
  AStar,
  JumpPoint,
  BiAStar,
  AStarHeap,
  BiAStarHeap,
  BFS,
  BiBFS,
  DFS,
  BiDFS,
  Dijkstar,
  FloydWarshall
} from '../model/finders/index'

export default {
  data() {
    return {
      alg: '',
      finder: 'AStar',
      finders: [{
        value: 'AStar',
        label: 'AStar'
      }, {
        value: 'JumpPoint',
        label: 'JumpPoint'
      }, {
        value: 'BiAStar',
        label: 'BiAStar'
      }, {
        value: 'AStarHeap',
        label: 'AStarHeap'
      }, {
        value: 'BiAStarHeap',
        label: 'BiAStarHeap'
      }, {
        value: 'BFS',
        label: 'BFS'
      }, {
        value: 'BiBFS',
        label: 'BiBFS'
      }, {
        value: 'DFS',
        label: 'DFS'
      }, {
        value: 'BiDFS',
        label: 'BiDFS'
      }, {
        value: 'Dijkstar',
        label: 'Dijkstar'
      }, {
        value: 'FloydWarshall',
        label: 'FloydWarshall'
      }],
      cornerWalk: 'Orthogonal',
      heuristic: 'Manhattan'
    }
  },

  mounted() {
    this.alg = new AStar(this.matrix);
  },

  computed: {
    ...mapGetters([
      'matrix'
    ]),

    isPreviousButton() {
      if (this.alg == '') {
        return true;
      } else {
        if (this.alg.isHistoryReady && this.alg.isPreviousStepAvailable()) {
          return false;
        } else {
          return true;
        }
      }
    },

    isNextButton() {
      if (this.alg == '' || !this.alg.isHistoryReady) {
        return false;
      } else {
        if (this.alg.isNextStepAvaiable()) {
          return false;
        } else {
          return true;
        }
      }
    }
  },

  methods: {
    ...mapActions([
      'UPDATE_MATRIX'
    ]),

    run() {
      this.clear();
      var flag = this.alg.findPath();
      if (flag) {
        this.$store.commit('UPDATE_MATRIX', this.alg.getFinalResult());
      } else {
        this.$message({
          showClose: true,
          message: 'Oops, Fail to run.',
          type: 'error'
        });
      }
    },

    clear() {
      this.matrix.clearMatrix();
      this.matrix.resetGraph();
      this.alg.resetFinder(this.matrix);
    },

    reset() {
      this.matrix.resetMatrix();
      this.matrix.setCornerWalk(this.cornerWalk);
      this.matrix.setHeuristic(this.heuristic);
      this.alg.resetFinder(this.matrix);
    },

    previous() {
      if (this.alg.isPreviousStepAvailable()) {
        this.$store.commit('UPDATE_MATRIX', this.alg.getPreviousStepMatrix());
      } else {
        this.$message({
          showClose: true,
          message: 'No previous step.',
          type: 'error'
        });
      }
    },

    next() {
      if (!this.alg.isHistoryReady) {
        var flag = this.alg.findPath();
        if (flag) {
          this.$store.commit('UPDATE_MATRIX', this.alg.getFirstResult());
        } else {
          this.$message({
            showClose: true,
            message: 'Oops, Fail to run.',
            type: 'error'
          });
        }
      } else {
        if (this.alg.isNextStepAvaiable()) {
          this.$store.commit('UPDATE_MATRIX', this.alg.getNextStepMatrix());
        } else {
          this.$message({
            showClose: true,
            message: 'No next step.',
            type: 'error'
          });
        }
      }
    },

    selectFinder(f) {
      this.clear();
      switch (f) {
        case 'AStar':
          this.alg = new AStar(this.matrix);
          break;
        case 'JumpPoint':
          this.alg = new JumpPoint(this.matrix);
          break;
        case 'BiAStar':
          this.alg = new BiAStar(this.matrix);
          break;
        case 'AStarHeap':
          this.alg = new AStarHeap(this.matrix);
          break;
        case 'BiAStarHeap':
          this.alg = new BiAStarHeap(this.matrix);
          break;
        case 'BFS':
          this.alg = new BFS(this.matrix);
          break;
        case 'BiBFS':
          this.alg = new BiBFS(this.matrix);
          break;
        case 'DFS':
          this.alg = new DFS(this.matrix);
          break;
        case 'BiDFS':
          this.alg = new BiDFS(this.matrix);
          break;
        case 'Dijkstar':
          this.alg = new Dijkstar(this.matrix);
          break;
        case 'FloydWarshall':
          this.alg = new FloydWarshall(this.matrix);
          break;
      }
    },

    selectCornerWalk(cw) {
      this.matrix.setCornerWalk(cw);
      this.matrix.resetGraph();
      this.alg.resetFinder(this.matrix);
    },

    selectHeuristic(h) {
      this.matrix.setHeuristic(h);
      this.matrix.resetGraph();
      this.alg.resetFinder(this.matrix);
    }
  }

}
</script>

<style lang="less" scoped>
@import "../assets/app.less";

.controls {
    width: @controls-width;
    border: @martix-border-width solid @martix-border-color;
    margin: 0;
    padding: 0;
}

.el-row {
    padding: 5px;
}

.el-button {
    width: 100%;
}
</style>
