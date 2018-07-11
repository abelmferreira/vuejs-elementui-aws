<template>
  <div class="instancesView">
    <h1>Instances</h1>
    <br>

    <el-table :data="instances" style="width: 100%;" :row-class-name="tableRowClassName">

      <el-table-column type="expand">
        <template slot-scope="props">
          <div v-if="props.row.needProtectIp">
            <span>Remote access alert!</span><br>
            <span> RDP Remote access allowed from </span><br>
            <p v-for="ip in props.row.AllowRdpFromResumed" :key="ip" class="text item"> {{ ip }} </p><br>
            <el-button plain @click="alloOnlyMyIP(props.row.InstanceId)" icon="el-icon-warning" type="danger">Allow only from my IP</el-button><br><br>
            <span> My IP is: {{ publicIp }} </span>
          </div>
          <div v-else>
            <span>Server protected!!</span>
            <span>RDP connections allowed only from {{ publicIp }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        label="Instance">
        <template slot-scope="scope">
          {{ scope.row.Name }}<br>
          {{ scope.row.InstanceState }}<br>
          {{ scope.row.LaunchTimeDate }}<br>
          {{ scope.row.LaunchTimeTime }}<br>
        </template>
      </el-table-column>

      <el-table-column
        fixed="right"
        label="Actions" >
        <template slot-scope="scope">

          <el-button plain v-if="scope.row.InstanceState === 'stopped' && !scope.row.isLoading"
            @click="turnOn(scope.row.InstanceId)"
            icon="el-icon-upload2"
            type="primary"/>

          <el-button plain v-if="scope.row.InstanceState === 'running' && !scope.row.isLoading"
            @click="turnOff(scope.row.InstanceId)"
            icon="el-icon-download"
            type="primary"/>

          <el-button plain v-if="scope.row.isLoading"
            :loading="scope.row.isLoading"
            type="warning"/>

          <el-button plain @click="describeInstanceStatus([scope.row.InstanceId])"
            icon="el-icon-refresh"
            type="info"/>

        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'

export default {
  name: 'Instances',
  data () {
    return {
      schedulerJobs: []
    }
  },
  computed: {
    ...mapState('User', ['user']),
    ...mapState('EC2', ['instances']),
    ...mapState('Shared', ['publicIp'])
  },
  methods: {
    ...mapActions('EC2', ['fullDescribeInstance', 'startInstance', 'stopInstance', 'checkMyIP', 'describeInstanceStatus', 'scheduleStatusRefresh']),
    ...mapActions('Shared', ['getMyPublicIP']),
    turnOn (id) {
      this.startInstance([id]).then(data => this.scheduleStatusRefresh(id))
    },
    turnOff (id) {
      this.stopInstance([id]).then(data => this.scheduleStatusRefresh(id))
    },
    alloOnlyMyIP () {
      console.log('alloOnlyMyIP')
    },
    tableRowClassName (row, rowIndex) {
      if (!row.row.needProtectIp) return 'success-row'
      else return 'warning-row'
    }
  },
  mounted () {
    this.fullDescribeInstance()
      .then(instances => this.getMyPublicIP())
      .then(myPubIp => this.checkMyIP())
      .then(() => this.scheduleStatusRefresh('reset'))
  }
}

</script>

<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
