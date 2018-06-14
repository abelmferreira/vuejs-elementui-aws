<template>
  <div class="dashboardview">
    <img src="../assets/logo.png">
    <Dashboard msg="Welcome to Your Vue.js App created with Vue Cli 3"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Dashboard from '@/components/Dashboard.vue'

export default {
  name: 'DashboardView',
  components: {
    Dashboard
  }
}
</script>
