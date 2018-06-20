<template>
    <div>
      <h1>Login</h1>
      <el-form ref="loginPassForm" :model="form" :rules="rules" label-width="0px">

        <el-form-item label="Username" prop="username">
          <el-input v-model="form.username" auto-complete="off" required></el-input>
        </el-form-item>

        <el-form-item label="Password" prop="password">
          <el-input type="password" v-model="form.password" auto-complete="off" required></el-input>
          <div class="form-input-extra-option" ><a @click="forgotPassword" class="form-input-extra-option-link">Forgot Password?</a> </div>
        </el-form-item>

        <div class="actions-buttons">
          <el-button type="primary" @click="login">Sign in</el-button>
          <el-button type="secondary" @click="signup">Sign up</el-button>
        </div>
      </el-form>
    </div>
</template>

<script>
import {mapActions, mapMutations, mapState} from 'vuex'

export default {
  name: 'Login',
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: 'Username is required', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Password is required', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState('User', ['loggedin', 'user', 'token'])
  },
  methods: {
    login () {
      this.$refs['loginPassForm'].validate(valid => {
        if (valid) this.userLogin(this.form)
      })
    },
    signup () {
      this.$router.push({name: 'Signup'})
    },
    forgotPassword () {
      this.$router.push({name: 'ForgotPass'})
    },
    ...mapActions('User', ['userLogin']),
    ...mapMutations('Alerts', ['addMessage'])
  }
}
</script>
