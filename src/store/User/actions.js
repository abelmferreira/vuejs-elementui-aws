export default {
  userLogin ({commit}, payload) {
    commit('Alerts/setLoadingMessage', 'Autenticando usuário', {root: true})

    setTimeout(() => {
      commit('setLoggedin', true)
      commit('Alerts/setLoadingMessage', null, {root: true})
    }, 1500)
  },

  userLogout ({commit}) {
    commit('setUserLogout', null)
  }
}
