<template>
  <el-container id="app">

    <el-header :height="this.gVar.headerHeight">
      <header-bar
        :maxMobileStyleSize="this.gVar.maxMobileStyleSize"
        title="AWS"
        :loggedin="loggedin" />
    </el-header>

    <el-main class="main-container">
      <router-view/>
    </el-main>

    <el-footer :height="this.gVar.footerHeight">
      VueJs AWS Simple Manager
    </el-footer>

  </el-container>
</template>

<script>
import {mapMutations, mapState} from 'vuex'
import HeaderBar from '@/components/HeaderBar'

export default {
  components: {
    HeaderBar
  },
  data () {
    return {
      loadingScreen: null
    }
  },
  computed: {
    ...mapState('User', ['loggedin']),
    ...mapState('Alerts', ['loading', 'messages', 'error'])
  },
  watch: {
    error (value) {
      if (value) this.$message({type: 'error', message: value, showClose: true, onClose: this.clearError, duration: 10000})
    },
    loading (value) {
      if (value) {
        this.loadingScreen = this.$loading({
          lock: true,
          text: this.loading,
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
      } else {
        if (this.loadingScreen) this.loadingScreen.close()
      }
    },
    messages (value) {
      if (value) {
        value.forEach(msg => {
          if (!msg.displayed) {
            this.markMessage(msg)
            this.$message({
              type: msg.type,
              message: msg.message,
              duration: msg.timeout,
              showClose: true,
              onClose: this.removeMessage,
              customClass: msg.id
            })
          }
        })
      }
    }
  },
  methods: {
    ...mapMutations('Alerts', ['clearError', 'removeMessage', 'markMessage'])
  }
}
</script>
