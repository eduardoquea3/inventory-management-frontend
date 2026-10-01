<template>
  <div class="container">
    <h1>{{ isEdit ? 'Editar' : 'Crear' }} Producto</h1>
    <p v-if="loadingProduct" role="status">Cargando producto...</p>
    <p v-if="loading" role="status">Guardando...</p>
    <p class="error" v-if="error" role="alert">{{ error }}</p>
    <p class="success" v-if="success" role="status">{{ success }}</p>

    <div class="card" v-if="!loadingProduct">
      <label for="product-name">Nombre</label>
      <input id="product-name" v-model.trim="form.name" placeholder="Nombre" required />
      <label for="product-description">Descripción</label>
      <textarea id="product-description" v-model="form.description" placeholder="Descripción"></textarea>
      <label for="product-price">Precio</label>
      <input id="product-price" v-model.number="form.price" type="number" step="any" placeholder="Precio" />
      <label for="product-stock">Stock</label>
      <input id="product-stock" v-model.number="form.stock" type="number" step="any" placeholder="Stock" />
      <select v-model="form.category_id">
        <option value="">Seleccione categoría</option>
        <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>
      <select v-model="form.status">
        <option :value="1">Activo</option>
        <option :value="0">Inactivo</option>
      </select>
      <button :disabled="loading || loadingProduct" @click="save">{{ loading ? 'Guardando...' : 'Guardar' }}</button>
    </div>
  </div>
</template>

<script>
import api from '../api'

export default {
  data() {
    return {
      loading: false,
      loadingProduct: false,
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
      this.loadingProduct = true
      api.get('/products/' + this.$route.params.id).then(res => {
        this.form = { ...this.form, ...res.data.data }
      }).catch(err => {
        this.error = err.userMessage
      }).finally(() => {
        this.loadingProduct = false
      })
    },
    save() {
      this.error = ''
      this.success = ''
      if (!this.form.name) {
        this.error = 'Nombre requerido'
        return
      }
      for (const field of ['price', 'stock']) {
        const value = this.form[field]
        if (value !== '' && value !== null && value !== undefined && !Number.isFinite(Number(value))) {
          this.error = field === 'price' ? 'Ingrese un precio válido' : 'Ingrese un stock válido'
          return
        }
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
