<template>
    <div class="loginbox">
      <h1>Login</h1>
      <el-form ref="loginForm" :model="form" :rules="rules" label-width="0px">

        <el-form-item label="Usuário" prop="username">
          <el-input v-model="form.username" auto-complete="off" required></el-input>
        </el-form-item>

        <el-form-item label="Senha" prop="password">
          <el-input type="password" v-model="form.password" auto-complete="off" required></el-input>
          <div class="form-input-extra-option" ><a @click="resetPassword" class="form-input-extra-option-link">Esqueceu a senha?</a> </div>
        </el-form-item>

        <div class="actions-buttons">
          <el-button type="primary" @click="login">Entrar</el-button>
          <el-button type="secondary" @click="signin">Cadastrar</el-button>
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
        username: 'user',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: 'Campo usuário é obrigatório', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Campo senha é obrigatório', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState('User', ['loggedin', 'user', 'token'])
  },
  watch: {
    loggedin (value) {
      if (value) this.$router.push('/')
    }
  },
  methods: {
    login () {
      this.$refs['loginForm'].validate(valid => {
        if (valid) this.userLogin(this.form)
      })
    },
    signin () {
      this.addMessage('In development!')
    },
    resetPassword () {
      this.addMessage('In development!')
    },
    ...mapActions('User', ['userLogin']),
    ...mapMutations('Alerts', ['addMessage'])
  }
}
</script>

<style>
.loginbox {
  max-width: 300px;
  margin: auto;
}
</style>
