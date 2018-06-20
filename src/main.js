import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import {sync} from 'vuex-router-sync'
import '@/registerServiceWorker'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'
import locale from 'element-ui/lib/locale/lang/pt-br'

import GlobalVariables from '@/config/variables'

import Amplify, { Logger } from 'aws-amplify'
import awsExports from './aws-exports'

Vue.config.productionTip = false
Vue.use(ElementUI, {locale})

Amplify.configure(awsExports)
Amplify.Logger.LOG_LEVEL = 'DEBUG'

const logger = new Logger('main')
logger.debug('System Loaded')

// Destroy session if lost user Token
// setInterval(() => {
//   Auth.currentUserInfo()
//     .then(user => {
//       if (user) {
//         store.commit('User/setLoggedin')
//         logger.debug(`User is logged in`)
//       } else {
//         store.commit('User/setUserLogout')
//         logger.debug(`User is logged out`)
//       }
//     })
//     .catch(err => logger.error(err))
// }, 90000)

// Mix global vars
Vue.mixin({
  data: function () {
    return {
      get gVar () {
        return GlobalVariables
      }
    }
  }
})

sync(store, router)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
