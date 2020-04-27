export default {
  state: {
    open: false
  },
  reducers: {
    open(state, props) {
      return {
        ...state,
        ...props,
        open: true
      }
    },
    close() {
      return {
        open: false
      }
    }
  }
}
