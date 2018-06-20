import { Auth, Logger, JS } from 'aws-amplify'
import router from '@/router'

const logger = new Logger('LoginAction')
const routeAfterLogin = '/'
const routeAfterLogout = '/login'
const routeAfterConfirm = '/'
const routeToConfirmCode = '/login/confirm'

const onError = (commit, err, title) => {
  logger.error(title, err)
  commit('Alerts/setError', `${title}: ${err.message}`, {root: true})
}

const onLoginSuccess = (commit, user) => {
  if (user) commit('setUser', user)
  commit('setLoggedin')
  logger.debug('Login steps Success!', user)
  router.push(routeAfterLogin)
}

export default {
  userLogin ({commit, dispatch}, payload) {
    commit('Alerts/setLoadingMessage', 'Authenticating', {root: true})

    Auth.signIn(payload.username, payload.password)
      .then(user => {
        logger.debug('Login Success!', user)
        return user
      })
      .then(user => {
        // If has multi factory authentication, ret
        if (user.challengeName === 'SMS_MFA') {
          user.needConfirmCode = true
          commit('setUser', user)
          router.push(routeToConfirmCode)
        } else {
          return dispatch('checkIfisUserVerified', user)
        }
      })
      .then(user => {
        commit('setUserSession', user)
        if (!user.verifiedUser) router.push('/login/confirm')
      })
      .then(user => {
        return Auth.currentUserInfo()
      })
      .then(user => {
        commit('Alerts/setLoadingMessage', null, {root: true})
        onLoginSuccess(commit, user)
      })
      .catch(err => {
        commit('setUserLogout')
        onError(commit, err, 'userLogin Error')
        router.push('/login')
      })
  },

  userLogout ({commit}) {
    commit('setUserLogout')
    Auth.signOut()
      .then(() => {
        logger.debug('Logout Success!')
        router.push(routeAfterLogout)
      })
      .catch(err => onError(commit, err, 'userLogout Error'))
  },

  userSignup ({commit}, payload) {
    // Auth.signUp(this.username, this.password, this.email, this.phone_number)
    return Auth.signUp(payload.username, payload.password, payload.email)
      .then(data => {
        logger.debug('Sign up Success!', data)
        router.push(routeToConfirmCode)
      })
      .catch(err => onError(commit, err, 'userSignup Error'))
  },

  // Verify if account is already verified
  checkIfisUserVerified ({commit}, user) {
    if (!user) return

    return Auth.verifiedContact(user)
      .then(data => {
        logger.debug('Verify user result', data)
        commit('setUserVerification', data)
        user.verifiedUser = !JS.isEmpty(data.verified)
        return user
      })
  },

  mfaConfirmCode: ({commit}, payload) => {
    return Auth.confirmSignIn(payload.user, payload.code)
      .then(() => {
        logger.debug('Code confirmed!')
        onLoginSuccess(commit, payload.user)
      })
      .catch(err => onError(commit, err, 'mfaConfirmCode Error'))
  },

  resendVeriricationCode: ({commit}, username) => {
    return Auth.resendSignUp(username)
      .then(() => commit('Alerts/addMessage', 'Code sended!', {root: true}))
      .catch(err => onError(commit, err, 'resendVeriricationCode Error'))
  },

  confirmVeriricationCode: ({commit, dispatch}, payload) => {
    return Auth.confirmSignUp(payload.username, payload.code)
      .then(() => router.push(routeAfterConfirm))
      .catch(err => onError(commit, err, 'confirmVeriricationCode Error'))
  },

  sendForgotPasswordCode: ({commit}, username) => {
    return Auth.forgotPassword(username)
      .then(() => commit('Alerts/addMessage', 'Code sended!', {root: true}))
      .catch(err => onError(commit, err, 'sendForgotPasswordCode Error'))
  },

  submitForgotPasswordCode: ({commit}, payload) => {
    Auth.forgotPasswordSubmit(payload.username, payload.code, payload.password)
      .then(() => {
        commit('Alerts/addMessage', {message: 'Password changed!', type: 'success'}, {root: true})
        router.push('/login')
      })
      .catch(err => onError(commit, err, 'submitForgotPasswordCode Error'))
  }
}
