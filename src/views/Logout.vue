<template>
    <div>
      <div>
        <h1>You are out!!</h1>
      </div>
    </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'

export default {
  name: 'Logout',
  computed: {
    ...mapState('User', ['loggedin'])
  },
  watch: {
    loggedin (value) {
      if (!value) {
        setTimeout(() => {
          this.$router.push('/login')
        }, 3000)
      }
    }
  },
  methods: {
    ...mapActions('User', ['userLogout'])
  },
  mounted () {
    this.userLogout()
  }
}
</script>
