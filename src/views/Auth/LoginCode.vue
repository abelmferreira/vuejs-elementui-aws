<template>
    <div>
      <h1>Validate MFA Code</h1>
      <el-form ref="loginCodeForm" :model="form" :rules="rules" label-width="0px">

        <el-form-item label="Username" prop="username">
          <el-input v-model="form.username" auto-complete="off" required disabled></el-input>
        </el-form-item>

        <el-form-item label="Code" prop="code">
          <el-input v-model="form.code" auto-complete="off" required></el-input>
        </el-form-item>

        <div class="actions-buttons">
          <el-button type="primary" @click="confirm">Confirm</el-button>
        </div>
      </el-form>
    </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'

export default {
  name: 'LoginCode',
  data () {
    return {
      form: {
        username: '',
        code: ''
      },
      rules: {
        code: [
          { required: true, message: 'Code is required', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState('User', ['user', 'loggedin'])
  },
  methods: {
    confirm () {
      this.$refs['loginCodeForm'].validate(valid => {
        if (valid) this.mfaConfirmCode({user: this.user, code: this.code})
      })
    },
    ...mapActions('User', ['mfaConfirmCode'])
  },
  created () {
    if (!this.loggedin || !this.user) {
      this.$router.push('/login')
    } else {
      this.form.username = this.user.username
    }
  }
}
</script>
