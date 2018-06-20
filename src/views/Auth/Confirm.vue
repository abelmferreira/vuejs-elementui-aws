<template>
    <div>
      <h1>Confirm Sign up</h1>
      <el-form ref="signupConfirmForm" :model="form" :rules="rules">

        <el-form-item label="Username" prop="username">
          <el-input v-model="form.username" auto-complete="off" required></el-input>
        </el-form-item>

        <el-form-item label="Code" prop="code">
          <el-input v-model="form.code" auto-complete="off" required></el-input>
        </el-form-item>

        <div class="actions-buttons">
          <el-button type="primary" @click="confirm">Confirm</el-button>
          <el-button type="secondary" @click="resend">Resend Code</el-button>
        </div>
      </el-form>
    </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'

export default {
  name: 'signupConfirmForm',
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
    ...mapState('User', ['user', 'loggedin', 'verification'])
  },
  methods: {
    confirm () {
      this.$refs['signupConfirmForm'].validate(valid => {
        if (valid) this.confirmVeriricationCode({username: this.form.username, code: this.form.code})
      })
    },
    resend () {
      this.resendVeriricationCode(this.form.username)
    },
    ...mapActions('User', ['resendVeriricationCode', 'confirmVeriricationCode'])
  },
  created () {
    if (this.user && this.user.username) {
      this.form.username = this.user.username
    }
  }
}
</script>
