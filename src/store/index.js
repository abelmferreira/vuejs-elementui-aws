import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import Shared from './Shared'
import User from './User'
import Alerts from './Alerts'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState({storage: window.sessionStorage})],
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    Shared,
    User,
    Alerts
  }
})
