export default {
  // UI
  UPDATE_ISLOADING : (state, isLoading) => {
    state.isLoading = isLoading;
  },

  // matrix
  UPDATE_MATRIX : (state, matrix) => {
    state.matrix = matrix;
  },

  // mouse actions
  UPDATE_LAST_CLICKED_CUBE_INDEX : (state, index) => {
    state.lastClickedCubeIndex = index;
  },

  UPDATE_SELECTED_CUBE_TYPE : (state, type) => {
    state.selectedCubeType = type;
  }
}
