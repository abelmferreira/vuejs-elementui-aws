export default {
  setLoggedin (state) {
    state.loggedin = true
  },
  setUser (state, user) {
    state.user = user
  },
  setUserSession (state, payload) {
    state.session = payload
  },
  setUserLogout (state) {
    state.loggedin = false
    state.token = null
    state.user = null
    state.session = null
    state.verification = []
  },
  setUserVerification (state, data) {
    state.verification = data
  }
}
