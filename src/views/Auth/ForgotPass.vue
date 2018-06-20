<template>
    <div>
      <h1>Forgot password</h1>
      <el-form ref="forgotPassForm" :model="form" :rules="rules">

        <el-form-item label="Username" prop="username">
          <el-input v-model="form.username" auto-complete="off" required autofocus=""></el-input>
        </el-form-item>

        <el-form-item label="Code" prop="code">
          <el-input v-model="form.code" auto-complete="off" required></el-input>
        </el-form-item>

        <el-form-item label="New Password" prop="password">
          <el-input type="password" v-model="form.password" auto-complete="off" required></el-input>
        </el-form-item>

        <el-form-item label="New Password confirm" prop="password2">
          <el-input type="password" v-model="form.password2" auto-complete="off" required></el-input>
        </el-form-item>

        <div class="actions-buttons">
          <el-button type="primary" @click="confirm">Confirm</el-button>
          <el-button type="secondary" @click="send">Send Code</el-button>
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
        code: '',
        password: '',
        password2: ''
      },
      rules: {
        code: [
          { required: true, message: 'Code is required', trigger: 'blur' }
        ],
        username: [
          { required: true, message: 'Username is required', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Password is required', trigger: 'blur' },
          { min: 8, message: 'Your password is too short!', trigger: 'blur' }
        ],
        password2: [
          { required: true, message: 'Password confirmation is required', trigger: 'blur' },
          { validator: this.validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState('User', ['user', 'loggedin', 'verification'])
  },
  methods: {
    validatePass2 (rule, value, callback) {
      (value !== this.form.password) ? callback(new Error('Passwords must be equal')) : callback()
    },
    confirm () {
      this.$refs['forgotPassForm'].validate(valid => {
        if (valid) this.submitForgotPasswordCode(this.form)
      })
    },
    send () {
      this.sendForgotPasswordCode(this.form.username)
    },
    ...mapActions('User', ['sendForgotPasswordCode', 'submitForgotPasswordCode'])
  }
}
</script>
