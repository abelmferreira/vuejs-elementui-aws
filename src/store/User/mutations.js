export default {
  setLoggedin (state, payload) {
    state.loggedin = payload
  },
  setUserLogout (state) {
    state.loggedin = false
    state.token = null
    state.user = null
  }
}
