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
Amplify.Logger.LOG_LEVEL = 'INFO'

const logger = new Logger('main')
logger.debug('System Loaded')

// Mix global vars
Vue.mixin({
  data: function () {
    return {
      get gVar () {
        return GlobalVariables
      },
      get aws () {
        return awsExports
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
