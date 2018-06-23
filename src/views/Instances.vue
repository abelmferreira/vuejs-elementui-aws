<template>
  <div class="instancesView">
    <h1>This is an instances page</h1>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import { Auth, API } from 'aws-amplify'

export default {
  name: 'Instances',
  data () {
    return {}
  },
  computed: {
    ...mapState('User', ['user', 'loggedin'])
  },
  mounted () {
    // console.log(this.user)
    console.log(this.user.signInUserSession.accessToken.jwtToken)
    Auth.currentSession()
      .then(session => console.log(session))

    let apiName = 'Ride'
    let path = '/instance'
    // let myInit = {
    //   headers: {
    //     Authorization: this.user.signInUserSession.accessToken.jwtToken
    //   },
    //   response: true,
    //   queryStringParameters: {}
    // }
    let myInit = {
      response: true,
      queryStringParameters: {}
    }

    API.get(apiName, path, myInit).then(response => {
      console.log(response)
    }).catch(error => {
      console.log(error)
    })
  }
}

</script>
