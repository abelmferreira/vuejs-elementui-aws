export default {
  setEC2 (state, ec2) {
    state.ec2 = ec2
  },
  setInstance (state, instanceData) {
    let instanceIndex = state.instances.findIndex(instance => instance.InstanceId === instanceData.InstanceId)
    if (instanceIndex < 0) {
      state.instances.push(instanceData)
    } else {
      let updatedInstances = Object.assign([], state.instances)
      updatedInstances[instanceIndex] = instanceData
      state.instances = updatedInstances
    }
  },
  updateInstance (state, instanceUpdate) {
    let instanceIndex = state.instances.findIndex(instance => instance.InstanceId === instanceUpdate.InstanceId)
    if (instanceIndex < 0) {
      throw new Error('Instance not found in State')
    } else {
      let updatedInstances = Object.assign([], state.instances)
      Object.assign(updatedInstances[instanceIndex], instanceUpdate)

      let instance = updatedInstances[instanceIndex]
      instance.isLoading = false

      if (instance.InstanceState === 'running' && (instance.InstanceStatus !== 'ok' || instance.SystemStatus !== 'ok')) {
        instance.isLoading = true
        instance.InstanceState = 'pending'
      } else if (instance.InstanceState === 'stopping') {
        instance.isLoading = true
      } else if (instance.InstanceState === 'pending') {
        instance.isLoading = true
      }

      state.instances = updatedInstances
    }
  },
  removeInstance (state, instanceId) {
    let instanceIndex = -1
    if (typeof instanceId === 'string') {
      instanceIndex = state.instances.findIndex(instance => instance.InstanceId === instanceId)
    } else {
      instanceIndex = state.instances.findIndex(instance => instance.InstanceId === instanceId.InstanceId)
    }

    if (instanceIndex < 0) throw new Error('Instance not found in State')
    else state.instances.splice(instanceIndex, 1)
  },
  clearInstances (state) {
    state.instances = []
  },
  clearEC2 (state) {
    state.ec2 = null
  },
  clearEC2all (state) {
    state.ec2 = null
    state.instances = []
  }
}
