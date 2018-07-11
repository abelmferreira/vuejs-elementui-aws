import { Logger } from 'aws-amplify'
import { EC2 } from 'aws-sdk'
import aws from '@/aws-exports'

const logger = new Logger('EC2')

// Api Guide
// https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeInstances.html
// https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeSecurityGroups.html

function timeConverter (timestamp) {
  const a = new Date(timestamp)
  // const a = new Date(unixTimestamp * 1000)
  // const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
  const year = a.getFullYear()
  const month = months[a.getMonth()]
  const date = ('0' + a.getDate()).slice(-2)
  const hour = a.getHours()
  const min = a.getMinutes()
  const sec = a.getSeconds()
  // const time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec
  const time = `${date}/${month}/${year} ${hour}:${min}:${sec}`
  return time
}

export default {
  registerEC2 ({commit, rootState}, credentials = null) {
    if (!credentials) credentials = rootState.User.user
    if (!credentials) throw new Error('Invalid User Credentials!')

    const ec2 = new EC2({
      apiVersion: '2016-11-15',
      region: aws.EC2.region,
      credentials: credentials,
      sessionToken: credentials
    })
    logger.debug('EC2 registered')
    commit('setEC2', ec2)
    return ec2
  },

  fullDescribeInstance ({state, dispatch, commit}) {
    commit('clearInstances')
    return dispatch('registerEC2')
      .then(ec2 => dispatch('describeInstances'))
      .then(instances => dispatch('describeInstanceStatus'))
      .then(instances => dispatch('describeInstancesSecurityGroup'))
      .then(instances => state.instances)
  },

  describeInstances ({state, commit, dispatch}, instances = []) {
    if (!state.ec2) throw new Error('EC2 not registered!')

    const params = { DryRun: false }
    if (instances.length > 0) params.InstanceIds = instances

    return new Promise(resolve => {
      state.ec2.describeInstances(params, function (err, data) {
        if (err) throw new Error(err)

        let allInstancesData = []

        data.Reservations[0].Instances.forEach(instance => {
          let NameIndex = instance.Tags.findIndex(tag => tag.Key === 'name' || tag.Key === 'Name')

          // Create resumed respose data
          let singleInstanceData = {
            Name: (instance.Tags[NameIndex].Value),
            InstanceId: instance.InstanceId,
            InstanceType: instance.InstanceType,
            LaunchTime: timeConverter(instance.LaunchTime),
            LaunchTimeDate: timeConverter(instance.LaunchTime).split(' ')[0],
            LaunchTimeTime: timeConverter(instance.LaunchTime).split(' ')[1],
            PubIpAddress: instance.PublicIpAddress,
            IpAddress: instance.PrivateIpAddress,
            InstanceState: instance.State.Name,
            InstanceStateReason: instance.StateReason,
            InstanceSg: instance.SecurityGroups,
            InstanceSgNames: instance.SecurityGroups.map(sg => sg.GroupName)
          }

          allInstancesData.push(singleInstanceData)
          commit('setInstance', singleInstanceData)
        })

        resolve(allInstancesData)
      })
    })
  },

  describeInstanceStatus ({commit, state}, instances = []) {
    if (!state.ec2) throw new Error('EC2 not registered!')
    if (instances.length < 1) instances = state.instances.map(instance => instance.InstanceId)
    if (instances.length < 1) throw new Error('Empty list!')

    const params = {
      DryRun: false,
      InstanceIds: instances,
      IncludeAllInstances: true
    }

    return new Promise(resolve => {
      state.ec2.describeInstanceStatus(params, function (err, data) {
        if (err) throw new Error(err)

        let allInstancesData = []
        data.InstanceStatuses.forEach(instance => {
          let singleInstanceData = {
            InstanceId: instance.InstanceId,
            InstanceState: instance.InstanceState.Name,
            InstanceStatus: instance.InstanceStatus.Status,
            SystemStatus: instance.SystemStatus.Status
          }
          allInstancesData.push(singleInstanceData)
          commit('updateInstance', singleInstanceData)
        })

        resolve(allInstancesData)
      })
    })
  },

  describeInstanceStatusIsLoading ({state, dispatch}, instance = null) {
    if (!state.ec2) throw new Error('EC2 not registered!')
    if (!instance) throw new Error('Invalid Instance!')

    return dispatch('describeInstanceStatus', [instance])
      .then(instanceStatus => {
        if (instanceStatus[0].InstanceState === 'running' && (instanceStatus[0].InstanceStatus !== 'ok' || instanceStatus[0].SystemStatus !== 'ok')) {
          return true
        } else if (instanceStatus[0].InstanceState === 'stopping') {
          return true
        } else if (instanceStatus[0].InstanceState === 'pending') {
          return true
        } else {
          return false
        }
      })
  },

  // Retrieve security group full data
  describeSecurityGroups ({state}, sgname = []) {
    const params = { DryRun: false }
    if (sgname.length > 0) params.GroupNames = sgname

    return new Promise(resolve => {
      state.ec2.describeSecurityGroups(params, function (err, data) {
        if (err) throw new Error(err.message)
        resolve(data.SecurityGroups)
      })
    })
  },

  // Return a Formated Instance Object with Security Group Informations
  describeInstancesSecurityGroup ({state, commit, dispatch}, instances = []) {
    // If empty instances
    if (instances.length < 1) instances = state.instances
    if (instances.length < 1) throw new Error('Empty list!')

    // Get detailed Security Group Information
    let instancesJob = instances.map(instance => {
      // Resumed IP list array
      instance.AllowRdpFromResumed = []

      return new Promise((resolve, reject) => {
        // Get Security Group Datails from instance list
        dispatch('describeSecurityGroups', instance.InstanceSgNames)
          .then(sgs => {
            // For each SG Name... get detailed info
            sgs.forEach(sg => {
              let sgIndex = instance.InstanceSg.findIndex(instanceSg => sg.GroupName === instanceSg.GroupName)
              instance.InstanceSg[sgIndex].allowRdpFrom = sg.IpPermissions
                .filter(rule => rule.ToPort === 3389)
                .map(rule => rule.IpRanges)

              instance.InstanceSg[sgIndex].allowRdpFrom = instance.InstanceSg[sgIndex].allowRdpFrom[0]

              // Create a Easy array map with all Allowed ips
              let allowRdpFromResumed = sg.IpPermissions
                .filter(rule => rule.ToPort === 3389)
                .map(rule => rule.IpRanges)
                .map(rule => rule.map(item => item.CidrIp))

              allowRdpFromResumed[0].forEach(ip => instance.AllowRdpFromResumed.push(ip))
            })
          })
          .then(() => {
            commit('updateInstance', instance)
            resolve(instance)
          })
      })
    })

    return Promise.all(instancesJob).then(instances => {
      return instances
    })
  },
  // Check if ip address exist in SG rules
  checkMyIP ({state, commit, rootState}, instances = []) {
    // If empty instances
    if (instances.length < 1) instances = state.instances
    if (instances.length < 1) throw new Error('Empty list!')

    // If not public IPO
    // if (!rootState.Shared.publicIp) throw new Error('Invalid public IP')

    instances.forEach(instance => {
      if (!rootState.Shared.publicIp) {
        instance.needProtectIp = undefined
      } else {
        let findIP = instance.AllowRdpFromResumed.find(allowedIp => allowedIp === `${rootState.Shared.publicIp}/32`)
        instance.needProtectIp = (!findIP)
      }
      commit('updateInstance', instance)
    })
  },

  startInstance ({state, dispatch, commit}, instancesIds = []) {
    if (instancesIds.length < 1) throw new Error('Empty list!')
    const params = {
      DryRun: false,
      InstanceIds: instancesIds
    }

    return new Promise(resolve => {
      state.ec2.startInstances(params, function (err, data) {
        if (err) throw new Error(err.message)
        dispatch('describeInstanceStatus', instancesIds)
        commit('Alerts/addMessage', 'Instance starting', {root: true})
        resolve(data)
      })
    })
  },

  stopInstance ({state, dispatch, commit}, instancesIds = []) {
    if (instancesIds.length < 1) throw new Error('Empty list!')
    const params = {
      DryRun: false,
      InstanceIds: instancesIds
    }

    return new Promise(resolve => {
      state.ec2.stopInstances(params, function (err, data) {
        if (err) throw new Error(err.message)
        dispatch('describeInstanceStatus', instancesIds)
        commit('Alerts/addMessage', 'Instance stopping', {root: true})
        resolve(data)
      })
    })
  },

  // Scheduler refresh instance status after power on or off
  scheduleStatusRefresh ({state, dispatch, commit}, instanceID) {
    const interval = 10000
    const maxCounter = 60

    if (instanceID === 'reset') {
      logger.debug('Reseting status refresh scheduler jobs')
      if (state.scheduledJobs.length > 0) {
        state.scheduledJobs.forEach(job => commit('deleteScheduler', job.instance))
      }
      if (state.instances.length > 0) {
        state.instances.forEach(instance => {
          if (instance.isLoading) dispatch('scheduleStatusRefresh', instance.InstanceId)
        })
      }

      return true
    }

    const index = state.scheduledJobs.findIndex(job => job.instance === instanceID)
    if (index > -1) return false // Don't allow duplicate scheduler

    // Create a new scheduler job object
    commit('newScheduler', instanceID)

    const funcId = setInterval(() => {
      const index = state.scheduledJobs.findIndex(job => job.instance === instanceID)
      dispatch('describeInstanceStatusIsLoading', instanceID)
        .then(isLoading => {
          // Incress scheduler job counter
          commit('addSchedulerCounter', instanceID)
          logger.debug(`${state.scheduledJobs[index].counter} -> Instance ${instanceID} loading is ${isLoading}`)

          // If loading stop or if get max counter
          if (!isLoading || state.scheduledJobs[index].counter > maxCounter) {
            commit('deleteScheduler', instanceID)
          }
        })
    }, interval)

    // Add to scheduler job object setInterval job ID
    commit('addSchedulerFunction', {instanceID, funcId})
  }

}

// Auth.currentCredentials()
//   .then(credentials => {
//     // console.log(this.user)

//     const ec2 = new EC2({
//       apiVersion: '2016-11-15',
//       region: this.aws.EC2.region,
//       credentials: Auth.essentialCredentials(credentials),
//       sessionToken: Auth.essentialCredentials(credentials)
//     })

//     const params3 = {
//       DryRun: false
//     }

//     let that = this

//     ec2.describeInstances(params3, function (err, data) {
//       if (err) console.log(err, err.message)
//       else console.log(data)

//       data.Reservations[0].Instances.forEach(instance => {
//         that.instancesData.push({
//           InstanceId: instance.InstanceId,
//           InstanceType: instance.InstanceType,
//           LaunchTime: timeConverter(instance.LaunchTime),
//           IpAddress: instance.PublicIpAddress,
//           State: instance.State.Name,
//           StateReason: instance.StateReason.Message,
//           Sg: instance.SecurityGroups
//         })
//       })
//     })
//   })
