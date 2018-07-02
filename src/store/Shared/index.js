export default {
  state: {
  },
  mutations: {
  },
  actions: {
    getMyPublicIP () {
      return new Promise((resolve, reject) => {
        let xmlhttp = new XMLHttpRequest()
        const myUrl = 'https://api.ipify.org'
        xmlhttp.onreadystatechange = function () {
          if (xmlhttp.readyState === 4 && xmlhttp.status === 200) resolve(xmlhttp.responseText)
        }
        xmlhttp.open('GET', myUrl, true)
        xmlhttp.send()
      })
    },
    // Check if ip address exist in a array
    findMyIP ({state}, payload) {
      let findIP = payload.ipArray.find(allowedIp => allowedIp === `${payload.myIp}/32`)
      return (!findIP)
    }
  },
  getters: {
  }
}
