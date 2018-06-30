<template>
  <div class="instancesView">
    <h1>This is an instances page</h1>

    <el-table
      :data="instancesData"
      style="width: 100%">
      <el-table-column
        prop="InstanceId"
        label="InstanceID"
        width="180">
      </el-table-column>
      <el-table-column
        prop="LaunchTime"
        label="LaunchTime"
        width="180">
      </el-table-column>
      <el-table-column
        prop="State"
        label="State">
      </el-table-column>
      <el-table-column
        prop="StateReason"
        label="StateReason">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import { Auth } from 'aws-amplify'
// import { API } from 'aws-amplify'

import { DynamoDB, EC2 } from 'aws-sdk'

function timeConverter (unixTimestamp) {
  const a = new Date(unixTimestamp * 1000)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const year = a.getFullYear()
  const month = months[a.getMonth()]
  const date = a.getDate()
  const hour = a.getHours()
  const min = a.getMinutes()
  const sec = a.getSeconds()
  const time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec
  return time
}

export default {
  name: 'Instances',
  data () {
    return {
      instancesData: []
    }
  },
  computed: {
    ...mapState('User', ['user', 'loggedin'])
  },
  mounted () {
    // teste
    // https://github.com/aws/aws-amplify/issues/581
    // https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Operations_Amazon_DynamoDB.html
    // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.JavaScript.html
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html
    // https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-table-read-write.html

    Auth.currentCredentials()
      .then(credentials => {
        // console.log(this.user)

        const ec2 = new EC2({
          apiVersion: '2016-11-15',
          region: this.aws.EC2.region,
          credentials: Auth.essentialCredentials(credentials),
          sessionToken: Auth.essentialCredentials(credentials)
        })

        const params3 = {
          DryRun: false
        }

        let that = this

        ec2.describeInstances(params3, function (err, data) {
          if (err) console.log(err, err.message)
          else console.log(data)

          data.Reservations[0].Instances.forEach(instance => {
            that.instancesData.push({
              InstanceId: instance.InstanceId,
              InstanceType: instance.InstanceType,
              LaunchTime: timeConverter(instance.LaunchTime),
              IpAddress: instance.PublicIpAddress,
              State: instance.State.Name,
              StateReason: instance.StateReason.Message,
              Sg: instance.SecurityGroups
            })
          })
        })

        // Retrieve security group descriptions
        ec2.describeSecurityGroups({}, function (err, data) {
          if (err) {
            console.log('Error', err)
          } else {
            // console.log('Success', JSON.stringify(data.SecurityGroups))
            console.log('Success', data.SecurityGroups)
          }
        })

        const db = new DynamoDB({
          region: this.aws.DynamoDB.region,
          credentials: Auth.essentialCredentials(credentials),
          sessionToken: Auth.essentialCredentials(credentials)
        })

        const doc = new DynamoDB.DocumentClient({
          region: this.aws.DynamoDB.region,
          apiVersion: '2012-08-10',
          credentials: Auth.essentialCredentials(credentials),
          sessionToken: Auth.essentialCredentials(credentials)
        })

        db.describeTable({TableName: this.aws.DynamoDB.table}, (err, data) => {
          if (err) {
            console.log('E1')
            console.log(err.message)
          } else {
            console.log('A1')
            console.log(data)
          }
        })

        const params = {
          TableName: this.aws.DynamoDB.table,
          KeyConditionExpression: `#uid = :authUid`,
          ExpressionAttributeNames: {
            '#uid': 'userId'
          },
          ExpressionAttributeValues: {
            ':authUid': credentials.data.IdentityId
          }
        }

        doc.query(params, (err, data) => {
          if (err) {
            console.log('E2')
            console.log(err)
          } else {
            console.log('A2')
            console.log(data)
          }
        })

        const params2 = {
          Item: {
            'userId': credentials.data.IdentityId,
            'instanceId': `instance_${(new Date().toISOString())}`,
            'description': 'testeAdd',
            'created_at': 1234,
            'campoQualquer': 1234
          },
          TableName: this.aws.DynamoDB.table
        }

        doc.put(params2, (err, data) => {
          if (err) {
            console.log('E3')
            console.log(err)
          } else {
            console.log('A3')
            console.log(data)
          }
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
