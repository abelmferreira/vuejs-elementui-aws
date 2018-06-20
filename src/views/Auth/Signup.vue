<template>
    <div>
      <h1>User Sign up</h1>
      <br>
      <el-form ref="loginSignupForm" :model="form" :rules="rules" label-position="right" label-width="160px">

        <el-form-item label="Username" prop="username">
          <el-input v-model="form.username" auto-complete="off" required></el-input>
        </el-form-item>

        <el-form-item label="Email" prop="email">
          <el-input type="email" v-model="form.email" auto-complete="off" required></el-input>
        </el-form-item>

        <el-form-item label="Phone Number" prop="phonenumber">
          <el-input v-model="form.phonenumber" auto-complete="off" required></el-input>
        </el-form-item>

        <el-form-item label="Password" prop="password">
          <el-input type="password" v-model="form.password" auto-complete="off" required></el-input>
        </el-form-item>

        <el-form-item label="Password confirm" prop="password2">
          <el-input type="password" v-model="form.password2" auto-complete="off" required></el-input>
        </el-form-item>

        <div class="actions-buttons">
          <el-button type="primary" @click="signup">Sign up</el-button>
          <el-button type="secondary" @click="cancel">Cancel</el-button>
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
        email: '',
        password: '',
        password2: '',
        phonenumber: null
      },
      rules: {
        username: [
          { required: true, message: 'Username is required', trigger: 'blur' }
        ],
        email: [
          { required: true, message: 'Email is required', trigger: 'blur' },
          { type: 'email', message: 'Please enter a valid email address', trigger: 'blur' }
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
    ...mapState('User', ['loggedin', 'user', 'token'])
  },
  methods: {
    validatePass2 (rule, value, callback) {
      (value !== this.form.password) ? callback(new Error('Passwords must be equal')) : callback()
    },
    signup () {
      this.$refs['loginSignupForm'].validate(valid => {
        this.userSignup(this.form)
      })
    },
    cancel () {
      this.$router.go(-1)
    },
    ...mapActions('User', ['userSignup']),
    ...mapMutations('Alerts', ['addMessage'])
  }
}
</script>
