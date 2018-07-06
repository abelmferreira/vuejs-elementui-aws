<template>
  <div class="instancesView">
    <h1>Instances page</h1>
    <br>

    <el-card class="box-card" v-for="instance in instances" v-bind:key="instance.InstanceId">
      <div slot="header" class="clearfix">
        <span> {{ instance.Name }} ( {{ instance.InstanceState }} )</span>
        <el-button v-if ="instance.InstanceState === 'stopped'" style="float: right; padding: 3px 0" @click="turnOn(instance.InstanceId)">Turn On</el-button>
        <el-button v-if ="instance.InstanceState === 'running'" style="float: right; padding: 3px 0" @click="turnOff(instance.InstanceId)">Turn Off</el-button>
        <el-button style="float: right; padding: 3px 0" @click="describeInstanceStatus([instance.InstanceId])">Refresh</el-button>
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

export default {
  name: 'Instances',
  data () {
    return {}
  },
  computed: {
    ...mapState('User', ['user']),
    ...mapState('EC2', ['instances']),
    ...mapState('Shared', ['publicIp'])
  },
  methods: {
    ...mapActions('EC2', ['registerEC2', 'describeInstances', 'describeInstanceStatus', 'describeInstancesSecurityGroup']),
    ...mapActions('EC2', ['startInstance', 'stopInstance', 'checkMyIP']),
    ...mapActions('Shared', ['getMyPublicIP']),
    turnOn (id) {
      console.log('turnOn')
      this.startInstance([id])
        .then(data => {
          console.log('start', data)
        })
    },
    turnOff (id) {
      console.log('turnOff')
      this.stopInstance([id])
        .then(data => {
          console.log('stop', data)
        })
    },
    alloOnlyMyIP () {
      console.log('alloOnlyMyIP')
    }
  },
  mounted () {
    this.registerEC2(this.user)
      .then(ec2Conn => this.describeInstances())
      .then(instances => this.describeInstancesSecurityGroup())
      .then(instances => this.getMyPublicIP())
      .then(myPubIp => this.checkMyIP())
      .then(() => {
        console.log('allDone', this.instances)
        console.log('publicIp', this.publicIp)
      })
  }
}

</script>
