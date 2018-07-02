<template>
  <div class="instancesView">
    <h1>Instances page</h1>
    <br>

    <el-card class="box-card" v-for="instance in instancesData" v-bind:key="instance.InstanceId">
      <div slot="header" class="clearfix">
        <span> {{ instance.Name }} ( {{ instance.State }} )</span>
        <el-button v-if ="instance.State === 'stopped'" style="float: right; padding: 3px 0" @click="turnOn">Turn On</el-button>
        <el-button v-if ="instance.State === 'running'" style="float: right; padding: 3px 0" @click="turnOff">Turn Off</el-button>
      </div>
      <div v-for="ip in instance.AllowRdpFromResumed" :key="ip" class="text item">
        RDP remote access allowed from {{ ip }}
      </div>
      <br>
      <div class="text item"> Your public IP {{ publicIp }} </div>
      <el-button v-if ="instance.needProtectIp" @click="alloOnlyMyIP">Allow only from my IP</el-button>
    </el-card>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
// import { API } from 'aws-amplify'

export default {
  name: 'Instances',
  data () {
    return {
      instancesData: [],
      publicIp: 'analisando...'
    }
  },
  computed: {
    ...mapState('User', ['user', 'loggedin'])
  },
  methods: {
    ...mapActions('EC2', ['describeInstances', 'describeInstancesSecurityGroup', 'registerEC2']),
    ...mapActions(['getMyPublicIP', 'findMyIP']),
    turnOn () {
      console.log('turnOn')
    },
    turnOff () {
      console.log('turnOff')
    },
    alloOnlyMyIP () {
      console.log('turnOff')
    }
  },
  mounted () {
    // Register EC2 State
    this.registerEC2(this.user)
      .then(ec2Conn => this.describeInstances())
      .then(instances => this.describeInstancesSecurityGroup(instances))
      .then(instances => {
        console.log('instances2', instances)
        this.instancesData = instances
      })
      .then(() => this.getMyPublicIP())
      .then(myPubIp => {
        this.publicIp = myPubIp
        this.instancesData.forEach(instance => {
          instance.needProtectIp = this.findMyIP({myIp: myPubIp, ipArray: instance.AllowRdpFromResumed})
        })
      })

    // // console.log(this.user)
    // console.log(this.user.signInUserSession.accessToken.jwtToken)
    // Auth.currentSession()
    //   .then(session => console.log(session))

    // let apiName = 'Ride'
    // let path = '/instance'
    // // let myInit = {
    // //   headers: {
    // //     Authorization: this.user.signInUserSession.accessToken.jwtToken
    // //   },
    // //   response: true,
    // //   queryStringParameters: {}
    // // }
    // let myInit = {
    //   response: true,
    //   queryStringParameters: {}
    // }

    // API.get(apiName, path, myInit).then(response => {
    //   console.log(response)
    // }).catch(error => {
    //   console.log(error)
    // })
  }
}

</script>
