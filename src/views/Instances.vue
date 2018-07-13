<template>
  <div class="instancesView">
    <h1>Instances</h1>
    <br>

    <span ></span>
    <el-alert
      v-if="unauthorized"
      title="Unauthorized access to EC2 api"
      type="error"
      description="Your aws infrastructure is not configured to allow access to aws ec2 apis, please check documentation."
      show-icon>
    </el-alert>

    <el-table :data="instances" style="width: 100%;" :row-class-name="tableRowClassName">

      <el-table-column type="expand">
        <template slot-scope="props">
          <div v-if="props.row.needProtectIp === true">
            <span>Remote access alert!</span><br>
            <span> RDP Remote access allowed from </span><br>
            <p v-for="(ip, index) in props.row.AllowRdpFromResumed" :key="index" class="text item"> {{ ip }} </p><br>
            <el-button plain @click="alloOnlyMyIP(props.row.InstanceId)" icon="el-icon-warning" type="danger">Allow only from my IP</el-button><br><br>
            <span> My IP is: {{ publicIp }} </span>
          </div>
          <div v-if="props.row.needProtectIp === undefined">
            <span> RDP Remote access allowed from </span><br>
            <p v-for="ip in props.row.AllowRdpFromResumed" :key="ip" class="text item"> {{ ip }} </p><br>
            <span style="color: red;"><b>Can not get your public IP, check browser blockers</b></span>
          </div>
          <div v-if="props.row.needProtectIp === false">
            <span>Server protected!!</span>
            <span>RDP connections allowed only from {{ publicIp }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Instance">
        <template slot-scope="scope">
          <div class="multipleLineRow">
            <div> {{ scope.row.Name }} </div>
            <div> {{ scope.row.InstanceState }} </div>
            <div> {{ scope.row.LaunchTimeDate }} </div>
            <div> {{ scope.row.LaunchTimeTime }} </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        fixed="right"
        label="Actions" >
        <template slot-scope="scope">

          <el-tooltip class="item" effect="dark" content="Power on" placement="top-start">
            <el-button plain v-if="scope.row.InstanceState === 'stopped' && !scope.row.isLoading"
              @click="turnOn(scope.row.InstanceId)"
              icon="el-icon-upload2"
              type="primary"/>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="Power off" placement="top-start">
            <el-button plain v-if="scope.row.InstanceState === 'running' && !scope.row.isLoading"
              @click="turnOff(scope.row.InstanceId)"
              icon="el-icon-download"
              type="primary"/>
          </el-tooltip>

          <el-button plain v-if="scope.row.isLoading"
            :loading="scope.row.isLoading"
            type="warning"/>

          <el-tooltip class="item" effect="dark" content="Refresh" placement="top-start">
            <el-button plain @click="describeInstanceStatus([scope.row.InstanceId])"
              icon="el-icon-refresh"
              type="info"/>
          </el-tooltip>

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
    return {}
  },
  computed: {
    ...mapState('User', ['user']),
    ...mapState('EC2', ['instances', 'unauthorized']),
    ...mapState('Shared', ['publicIp'])
  },
  methods: {
    ...mapActions('EC2', ['fullDescribeInstance', 'describeInstanceStatus', 'updateIngressRule']),
    ...mapActions('EC2', ['startInstance', 'stopInstance', 'checkMyIP', 'scheduleStatusRefresh', 'updateIngressRule']),
    ...mapActions('Shared', ['getMyPublicIP']),
    turnOn (id) {
      this.startInstance([id]).then(data => this.scheduleStatusRefresh(id))
    },
    turnOff (id) {
      this.stopInstance([id]).then(data => this.scheduleStatusRefresh(id))
    },
    alloOnlyMyIP (id) {
      this.updateIngressRule({publicIp: this.publicIp, instanceId: id})
    },
    tableRowClassName (row, rowIndex) {
      if (row.row.needProtectIp === false) return 'success-row'
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
