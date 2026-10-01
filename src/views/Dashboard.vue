<template>
  <div class="container">
    <h1>Dashboard</h1>
    <p v-if="loading">Cargando...</p>
    <p class="error" v-if="error">{{ error }}</p>

    <div class="card">
      <h3>Productos: {{ data.products }}</h3>
      <h3>Categorías: {{ data.categories }}</h3>
      <h3>Bajo stock: {{ data.low_stock ? data.low_stock.length : 0 }}</h3>
    </div>

    <div class="card">
      <h3>Últimos movimientos</h3>
      <ul>
        <li v-for="m in data.last_movements" :key="m.id">
          {{ m.type }} - {{ m.quantity }} - {{ m.reason }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import api from '../api'

export default {
  data() {
    return {
      loading: false,
      error: '',
      data: {}
    }
  },
  mounted() {
    this.loading = true
    api.get('/dashboard').then(res => {
      this.data = res.data
    }).catch(err => {
      this.error = err.userMessage
    }).finally(() => {
      this.loading = false
    })
  }
}
</script>
