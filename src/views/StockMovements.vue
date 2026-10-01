<template>
  <div class="container">
    <h1>Movimientos de Stock</h1>
    <router-link to="/products">Volver</router-link>

    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <p v-if="success" class="success" role="status">{{ success }}</p>

    <form class="card" @submit.prevent="save">
      <label for="movement-type">Tipo</label>
      <select id="movement-type" v-model="form.type" :disabled="saving">
        <option value="entrada">Entrada</option>
        <option value="salida">Salida</option>
      </select>

      <label for="movement-quantity">Cantidad</label>
      <input
        id="movement-quantity"
        v-model="form.quantity"
        name="quantity"
        type="number"
        step="any"
        min="0"
        placeholder="Cantidad"
        required
        :disabled="saving"
        @input="clearMessages"
      />

      <label for="movement-reason">Motivo</label>
      <input
        id="movement-reason"
        v-model="form.reason"
        name="reason"
        placeholder="Motivo"
        :disabled="saving"
        @input="clearMessages"
      />

      <button type="submit" :disabled="saving || loading">
        {{ saving ? 'Registrando…' : 'Registrar movimiento' }}
      </button>
    </form>

    <p v-if="loading" role="status">Cargando movimientos…</p>
    <p v-else-if="!error && movements.length === 0">Todavía no hay movimientos de stock.</p>

    <table v-if="movements.length > 0">
      <thead>
        <tr>
          <th>ID</th>
          <th>Tipo</th>
          <th>Cantidad</th>
          <th>Motivo</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="movement in movements" :key="movement.id">
          <td>{{ movement.id }}</td>
          <td>{{ movement.type }}</td>
          <td>{{ movement.quantity }}</td>
          <td>{{ movement.reason }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import api from '../api'

const emptyForm = () => ({ type: 'entrada', quantity: '', reason: '' })

export default {
  data() {
    return {
      movements: [],
      form: emptyForm(),
      loading: false,
      saving: false,
      error: '',
      success: ''
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    clearMessages() {
      this.error = ''
      this.success = ''
    },
    async load() {
      this.loading = true
      this.error = ''
      try {
        const response = await api.get('/products/' + this.$route.params.id + '/stock-movements')
        this.movements = response.data
      } catch (error) {
        this.error = error.userMessage
      } finally {
        this.loading = false
      }
    },
    async save() {
      this.clearMessages()
      const quantity = Number(this.form.quantity)
      if (!this.form.quantity || !Number.isFinite(quantity) || quantity <= 0) {
        this.error = 'Ingresá una cantidad numérica mayor que cero.'
        return
      }

      this.saving = true
      try {
        await api.post('/products/' + this.$route.params.id + '/stock-movements', this.form)
        this.success = 'Movimiento registrado.'
        this.form = emptyForm()
        await this.load()
      } catch (error) {
        this.error = error.response?.data?.message || error.userMessage
      } finally {
        this.saving = false
      }
    }
  }
}
</script>
