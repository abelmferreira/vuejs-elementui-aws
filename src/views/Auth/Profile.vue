<template>
    <div>
      <h1>User Profile</h1>
      <br>
      <el-form ref="profileForm" :model="form" label-position="right" label-width="160px">

        <el-form-item label="Avatar" prop="avatar">
          <photo-picker :path="'avatars/' + userId" />
        </el-form-item>

        <!-- Simple Form component example /> -->
        <!-- <a-simple-form :path="'profiles/' + userId" :fields="fields" :theme="theme" v-if="userId" /> -->

        <el-form-item label="Username" prop="username">
          <el-input v-model="form.username" auto-complete="off" required disabled></el-input>
        </el-form-item>

        <el-form-item label="Email" prop="email">
          <el-input type="email" v-model="form.email" auto-complete="off" required disabled></el-input>
        </el-form-item>

        <el-form-item label="Phone Number" prop="phonenumber">
          <el-input v-model="form.phone_number"></el-input>
        </el-form-item>

        <el-form-item label="First Name" prop="givenname">
          <el-input v-model="form.given_name"></el-input>
        </el-form-item>

        <el-form-item label="Last Name" prop="familyname">
          <el-input v-model="form.family_name"></el-input>
        </el-form-item>

        <el-form-item label="Gender" prop="gender">
          <el-select v-model="form.gender" placeholder="Select Gender" style="width: 100%;">
            <el-option label="Male" value="Male"></el-option>
            <el-option label="Female" value="Female"></el-option>
          </el-select>
        </el-form-item>

        <div class="actions-buttons">
          <el-button type="primary" @click="submit">Update Profile</el-button>
          <el-button type="secondary" @click="cancel">Cancel</el-button>
        </div>
      </el-form>
    </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import PhotoPicker from '@/components/PhotoPicker.vue'

export default {
  name: 'Login',
  components: { PhotoPicker },
  data () {
    return {
      form: {
        username: null,
        email: null,
        phone_number: null,
        given_name: null,
        family_name: null,
        gender: null
      }
    }
  },
  computed: {
    userId () {
      console.log(this.user)
      return this.user.id
    },
    ...mapState('User', ['loggedin', 'user'])
  },
  methods: {
    submit () {
      this.userUpdateAttributes({user: this.user, form: this.form})
    },
    cancel () {
      this.$router.go(-1)
    },
    ...mapActions('User', ['userUpdateAttributes'])
  },
  created () {
    this.form.username = (this.user.username)
    this.form.email = (this.user.attributes.email)
    this.form.phone_number = (this.user.attributes.phone_number)
    this.form.given_name = (this.user.attributes.given_name)
    this.form.family_name = (this.user.attributes.family_name)
    this.form.gender = (this.user.attributes.gender)
  }
}
</script>
