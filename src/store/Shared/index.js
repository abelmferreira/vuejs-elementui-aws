export default {
  namespaced: true,
  state: {
    publicIp: null
  },
  mutations: {
    setPublicIp (state, ip) {
      state.publicIp = ip
    }
  },
  actions: {
    getMyPublicIP ({commit}) {
      return new Promise((resolve, reject) => {
        let xmlhttp = new XMLHttpRequest()
        const myUrl = 'https://api.ipify.org'
        xmlhttp.onreadystatechange = function () {
          if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            commit('setPublicIp', xmlhttp.responseText)
            resolve(xmlhttp.responseText)
          } else {
            commit('setPublicIp', null)
          }
        }
        xmlhttp.open('GET', myUrl, true)
        xmlhttp.send()
      })
    }
  },
  getters: {
  }
}
