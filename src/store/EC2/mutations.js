export default {
  setEC2 (state, ec2) {
    state.ec2 = ec2
  },
  setInstance (state, instance) {
    state.instance = instance
  },
  clearEC2 (state) {
    state.ec2 = null
  }
}
