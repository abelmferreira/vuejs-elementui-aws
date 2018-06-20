export default {
  setLoadingMessage (state, payload) {
    state.loading = (payload || null)
  },
  addMessage (state, payload) {
    const msgid = `msg-id-${Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36)}`
    if (typeof payload === 'string') {
      payload = { id: msgid, message: payload, type: 'info', timeout: 4000 }
    } else if (typeof payload === 'object') {
      payload.id = msgid
      payload.message = (payload.message || null)
      payload.type = (payload.type || 'info')
      payload.timeout = (payload.timeout || 4000)
    }

    if (payload.type === 'loading') {
      state.loading = payload.message
    } else {
      state.messages.push(payload)
    }
  },
  markMessage (state, payload) {
    const index = state.messages.findIndex(message => message === payload)
    state.messages[index].displayed = true
  },
  removeMessage (state, payload) {
    state.messages = state.messages.filter(message => message.id !== payload.customClass)
  },
  clearMessages (state) {
    state.messages = []
  },
  setError (state, payload) {
    this.commit('Alerts/setLoadingMessage')
    state.error = payload
  },
  clearError (state) {
    state.error = false
  }
}
