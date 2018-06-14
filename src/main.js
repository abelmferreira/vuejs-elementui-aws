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

Vue.config.productionTip = false
Vue.use(ElementUI, {locale})

router.beforeEach((to, from, next) => {
  if ((to.meta.requiresAuth && store.state.loggedin) || to.path.startsWith('/login')) {
    next()
  } else if (!to.meta.requiresAuth) {
    next()
  } else {
    store.commit('Alerts/setError', 'Necessário fazer login para continuar')
    next('/login')
  }
})

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
