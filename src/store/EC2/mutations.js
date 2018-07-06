export default {
  setEC2 (state, ec2) {
    state.ec2 = ec2
  },
  setInstance (state, instanceData) {
    let instanceIndex = state.instances.findIndex(instance => instance.InstanceId === instanceData.InstanceId)
    if (instanceIndex < 0) state.instances.push(instanceData)
    else state.instances[instanceIndex] = instanceData
    console.log('Sate Instances Updated', state.instances)
  },
  updateInstance (state, instanceUpdate) {
    let instanceIndex = state.instances.findIndex(instance => instance.InstanceId === instanceUpdate.InstanceId)
    if (instanceIndex < 0) throw new Error('Instance not found in State')
    else Object.assign(state.instances[instanceIndex], instanceUpdate)
    console.log('Sate Instances Updated', state.instances)
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
    console.log('Sate Isntances Updated', state.instances)
  },
  clearInstances (state) {
    state.instances = []
    console.log('Sate Instances Updated', state.instances)
  },
  clearEC2 (state) {
    state.ec2 = null
  }
}
