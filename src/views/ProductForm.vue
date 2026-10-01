<template>
  <div class="container">
    <h1>{{ isEdit ? 'Editar' : 'Crear' }} Producto</h1>
    <p v-if="loading">Guardando...</p>
    <p class="error" v-if="error">{{ error }}</p>
    <p class="success" v-if="success">{{ success }}</p>

    <div class="card">
      <input v-model="form.name" placeholder="Nombre" />
      <textarea v-model="form.description" placeholder="Descripción"></textarea>
      <input v-model="form.price" placeholder="Precio" />
      <input v-model="form.stock" placeholder="Stock" />
      <select v-model="form.category_id">
        <option value="">Seleccione categoría</option>
        <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>
      <select v-model="form.status">
        <option :value="1">Activo</option>
        <option :value="0">Inactivo</option>
      </select>
      <button @click="save">Guardar</button>
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
      success: '',
      categories: [],
      form: {
        name: '',
        description: '',
        price: '',
        stock: '',
        category_id: '',
        status: 1
      }
    }
  },
  computed: {
    isEdit() {
      return !!this.$route.params.id
    }
  },
  mounted() {
    this.loadCategories()
    if (this.isEdit) this.loadProduct()
  },
  methods: {
    loadCategories() {
      api.get('/categories').then(res => this.categories = res.data.categories).catch(err => {
        this.error = err.userMessage
      })
    },
    loadProduct() {
      api.get('/products/' + this.$route.params.id).then(res => {
        this.form = res.data.data
      }).catch(err => {
        this.error = err.userMessage
      })
    },
    save() {
      // Legacy issue: weak validation and allows invalid numeric values.
      if (!this.form.name) {
        this.error = 'Nombre requerido'
        return
      }

      this.loading = true
      const url = '/products' + (this.isEdit ? '/' + this.$route.params.id : '')
      const method = this.isEdit ? 'put' : 'post'

      api({
        method,
        url,
        data: this.form
      }).then(() => {
        this.success = 'Guardado correctamente'
        setTimeout(() => this.$router.push('/products'), 800)
      }).catch(err => {
        this.error = err.userMessage
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
