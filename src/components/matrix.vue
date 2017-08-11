<template>
<div class="matrix" v-loading='isLoading'>
  <cube v-for='n in 100' :index='n' :key="n"></cube>
</div>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex'

import cube from './cube'
import {
  Matrix
} from '../model/Matrix'

export default {
  beforeMount() {
    var matrix = new Matrix();
    this.$store.commit('UPDATE_MATRIX', matrix);
  },

  computed: {
    ...mapGetters([
      'isLoading'
    ]),
  },

  methods: {
    ...mapActions([
      'UPDATE_MATRIX'
    ]),
  },

  components: {
    cube
  }
}
</script>

<style lang="less" scoped>
@import "../assets/app.less";

.matrix {
    width: @martix-width;
    height: @matrix-height;
    border: @martix-border-width solid @martix-border-color;
    background-color: @martix-background-color;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: repeat(10, 1fr);
    grid-auto-rows: minmax(1fr, 1fr);
    grid-gap: 1px;
    /*grid-column-gap: 1px; grid-row-gap: 1px;*/
}
</style>
