import { Auth, Logger, JS } from 'aws-amplify'
import router from '@/router'

const logger = new Logger('LoginAction')
const routeAfterLogin = '/instances'
const routeAfterLogout = '/login'
const routeAfterConfirm = '/'
const routeToConfirmCode = '/login/confirm'

// Api Guide
// https://aws.github.io/aws-amplify/media/authentication_guide

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

const onNeedRedirect = (commit, user, to) => {
  if (user) commit('setUser', user)
  router.push(to)
}

const onUserLogout = (commit) => {
  commit('User/setUserLogout', null, {root: true})
  commit('EC2/clearEC2all', null, {root: true})
  commit('DynamoDB/clearDatabases', null, {root: true})
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
        return dispatch('checkIfUserIsVerified', user)
      })
      .then(user => {
        if (!user.verifiedUser) onNeedRedirect(commit, user, '/login/confirm')
        return user
      })
      .then(user => {
        return Auth.currentUserInfo()
          .then(extraUserInfo => Object.assign(user, extraUserInfo))
      })
      .then(user => {
        return Auth.currentCredentials()
          .then(credentials => Object.assign(user, Auth.essentialCredentials(credentials)))
      })
      .then(user => {
        return dispatch('DynamoDB/log', {user: user, action: 'User logged in'}, {root: true})
          .then(() => user)
      })
      .then(user => {
        commit('Alerts/setLoadingMessage', null, {root: true})

        // If has multi factory authentication, ret
        if (user.challengeName === 'SMS_MFA') {
          user.needConfirmCode = true
          onNeedRedirect(commit, user, routeToConfirmCode)
        } else {
          onLoginSuccess(commit, user)
        }
      })
      .catch(err => {
        onUserLogout(commit)
        onError(commit, err, 'userLogin Error')
        router.push('/login')
      })
  },

  userLogout ({commit, state, dispatch}) {
    let cloneUser = Object.assign({}, state.user)

    if (cloneUser.loggedin) {
      dispatch('DynamoDB/log', {user: cloneUser, action: 'User logged out'}, {root: true})
        .then(() => {
          commit('DynamoDB/clearDatabases', null, {root: true})
          commit('EC2/clearEC2', null, {root: true})
        })
        .catch(err => { throw new Error('LogError', err) })
    }

    Auth.signOut()
      .then(() => {
        onUserLogout(commit)
        logger.debug('Logout Success!')
        router.push(routeAfterLogout)
      })
      .catch(err => onError(commit, err, 'userLogout Error'))
  },

  userSignup ({commit}, payload) {
    // Auth.signUp(this.username, this.password, this.email, this.phone_number)
    // Can pass attributes on sign up too:
    // 'attributes': {
    //   'email': 'me@domain.com',
    //   'phone_number': '+12128601234', // E.164 number convention
    //   'given_name': 'Jane',
    //   'family_name': 'Doe',
    //   'nickname': 'Jane'
    // }
    return Auth.signUp(payload.username, payload.password, payload.email)
      .then(data => {
        logger.debug('Sign up Success!', data)
        router.push(routeToConfirmCode)
      })
      .catch(err => onError(commit, err, 'userSignup Error'))
  },

  userUpdateAttributes ({commit}, payload) {
    return Auth.updateUserAttributes(payload.user, {
      phone_number: payload.form.phone_number,
      given_name: payload.form.given_name,
      family_name: payload.form.family_name,
      gender: payload.form.gender
    })
      .then(result => commit('Alerts/addMessage', 'User updated!', {root: true}))
      .catch(err => onError(commit, err, 'userUpdateAttributes Error'))
  },

  // Verify if current user is authenticated with a valid token
  checkIfUserisAuthenticated () {
    return Auth.currentAuthenticatedUser()
      .then(user => {
        logger.debug('User is Authenticated!!', user)
        return user
      })
      .catch(err => {
        logger.debug('User not authenticated!!', err)
        return false
      })
  },

  // Verify if account is already verified
  checkIfUserIsVerified ({commit}, user) {
    if (!user) return
    return Auth.verifiedContact(user)
      .then(data => {
        logger.debug('Verify user result', data)
        commit('setUserVerification', data)
        user.verifiedUser = !JS.isEmpty(data.verified)
        return user
      })
  },

  // Get current user Credentials ID
  getCurrentCredentialsID ({dispatch}) {
    return dispatch('checkIfUserisAuthenticated')
      .then(user => {
        if (user) {
          return Auth.currentCredentials()
        } else {
          throw new Error('not_autenticated')
        }
      })
      .then(credentials => {
        return credentials.identityId
      })
      .catch(err => {
        logger.debug('User not authenticated!!', err)
        return false
      })
  },

  // Get current user info
  getCurrentUserInfo () {
    return Auth.currentUserInfo()
      .then(user => user)
      .catch(err => err)
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
