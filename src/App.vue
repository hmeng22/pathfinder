<template>
<div id="app">
  <matrix></matrix>
  <controls></controls>
</div>
</template>

<script>
import matrix from './components/matrix.vue'
import controls from './components/controls.vue'

export default {
  name: 'app',
  components: {
    matrix,
    controls
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}
</style>
