<template>
  <div class="container">
    <div class="card">
      <h2>Login Legacy</h2>
      <p class="error" v-if="error">{{ error }}</p>
      <input v-model="email" placeholder="Email" />
      <input v-model="password" placeholder="Password" type="password" />
      <button @click="login">Ingresar</button>
    </div>
  </div>
</template>

<script>
import api from '../api'
import { useAuthStore } from '../stores/auth'

export default {
  data() {
    return {
      email: 'admin@legacy.test',
      password: 'password',
      error: ''
    }
  },
  methods: {
    login() {
      // Legacy issue: no loading state and no strong frontend validation.
      api.post('/login', {
        email: this.email,
        password: this.password
      }).then(res => {
        useAuthStore().setToken(res.data.token)
        this.$router.push('/dashboard')
      }).catch(err => {
        this.error = err.userMessage
      })
    }
  }
}
</script>
