export default {
  setDatabase (state, database) {
    state.db = database
  },
  setDocClient (state, doc) {
    state.doc = doc
  },
  clearDatabases (state) {
    state.db = null
    state.doc = null
  }
}
