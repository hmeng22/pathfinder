<template>
<div id="app">
  <matrix></matrix>
  <controls></controls>
  <tutorial></tutorial>
  <footer>Project Hosted on <a href="https://github.com/hmeng22/pathfinder" target="_blank">Github</a></footer>
</div>
</template>

<script>
import matrix from './components/matrix.vue'
import controls from './components/controls.vue'
import tutorial from './components/tutorial.vue'

export default {
  name: 'app',
  components: {
    matrix,
    controls,
    tutorial
  }
}
</script>

<style>
#app {
  font-family: 'Roboto', sans-serif;
  min-height: 998px;
}

.matrix {
  float: left;
}

.controls {
  float: left;
}

.tutorial {
  clear: both;
  float: left;
}

footer {
  position: fixed;
  bottom: 10px;
  right: 10px;
  text-align: center;
  font-size: 80%;
}
</style>
