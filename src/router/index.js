import Vue from 'vue'
import Router from 'vue-router'

import Store from '@/store'

import Home from '@/views/Home.vue'
import Dashboard from '@/views/Dashboard.vue'
import NotFound from '@/views/Errors/notFound.vue'
import Login from '@/views/Auth/Login.vue'
import LoginPass from '@/views/Auth/LoginPass.vue'
import LoginCode from '@/views/Auth/LoginCode.vue'
import Signup from '@/views/Auth/Signup.vue'
import Confirm from '@/views/Auth/Confirm.vue'
import ForgotPass from '@/views/Auth/ForgotPass.vue'
import Logout from '@/views/Auth/Logout.vue'
import Instances from '@/views/Instances.vue'

Vue.use(Router)

const defaultRoute = { path: '*', component: NotFound }

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      component: Login,
      meta: { requiresAuth: false },
      children: [
        {
          path: '',
          name: 'Login',
          component: LoginPass
        },
        {
          path: 'code',
          name: 'loginCode',
          component: LoginCode
        },
        {
          path: 'confirm',
          name: 'loginConfirm',
          component: Confirm
        },
        {
          path: 'signup',
          name: 'Signup',
          component: Signup
        },
        {
          path: 'forgot',
          name: 'ForgotPass',
          component: ForgotPass
        }
      ]
    },
    {
      path: '/logout',
      name: 'Logout',
      component: Logout,
      meta: { requiresAuth: false }
    },
    {
      path: '/instances',
      name: 'Instances',
      component: Instances,
      meta: { requiresAuth: true }
    },
    defaultRoute
  ]
})

router.beforeEach((to, from, next) => {
  if ((to.meta.requiresAuth && Store.state.loggedin) || to.path.startsWith('/login')) {
    next()
  } else if (!to.meta.requiresAuth) {
    next()
  } else {
    Store.commit('Alerts/setError', 'Need auth to continue')
    next('/login')
  }
})

export default router
