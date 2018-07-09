export default {
  setLoggedin (state) {
    state.loggedin = true
  },
  setUser (state, user) {
    state.user = user
  },
  updateUserCredentials (state, credentials) {
    Object.assign(state.user, credentials)
  },
  setUserLogout (state) {
    state.loggedin = false
    state.token = null
    state.user = null
    state.verification = []
  },
  setUserVerification (state, data) {
    state.verification = data
  }
}
