<template>
  <div class="container">
    <h1>Productos</h1>
    <router-link to="/products/new">Nuevo producto</router-link>

    <div class="card">
      <input v-model="q" placeholder="Buscar producto" @keyup.enter="loadProducts" />
      <select v-model="category_id">
        <option value="">Todas las categorías</option>
        <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>
      <button :disabled="loading" @click="loadProducts">{{ loading ? 'Buscando...' : 'Buscar' }}</button>
    </div>

    <p v-if="loading" role="status">Cargando productos...</p>
    <p class="error" v-if="error" role="alert">{{ error }}</p>
    <p class="success" v-if="success" role="status">{{ success }}</p>
    <p v-if="!loading && !error && products.length === 0">No se encontraron productos.</p>

    <table v-if="products.length > 0">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in products" :key="p.id">
          <td>{{ p.id }}</td>
          <td>{{ p.name }}</td>
          <td>{{ p.category ? p.category.name : '-' }}</td>
          <td>{{ p.price }}</td>
          <td>{{ p.stock }}</td>
          <td>
            <router-link :to="'/products/' + p.id + '/edit'">Editar</router-link>
            <router-link :to="'/products/' + p.id + '/stock'">Stock</router-link>
            <button :disabled="deletingId === p.id" @click="remove(p.id)">{{ deletingId === p.id ? 'Eliminando...' : 'Eliminar' }}</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import api from '../api'

export default {
  data() {
    return {
      products: [],
      categories: [],
      loading: false,
      error: '',
      success: '',
      q: '',
      category_id: '',
      deletingId: null
    }
  },
  mounted() {
    this.loadCategories()
    this.loadProducts()
  },
  methods: {
    loadCategories() {
      api.get('/categories').then(res => {
        this.categories = res.data.categories
      }).catch(err => {
        this.error = err.userMessage
      })
    },
    loadProducts() {
      this.loading = true
      this.error = ''
      this.success = ''
      const params = new URLSearchParams({ q: this.q, category_id: this.category_id })
      api.get('/products?' + params.toString()).then(res => {
        // Legacy issue: assumes backend returns array directly.
        this.products = res.data
      }).catch(err => {
        this.error = err.userMessage
      }).finally(() => {
        this.loading = false
      })
    },
    remove(id) {
      if (!confirm('¿Eliminar producto?')) return
      this.error = ''
      this.success = ''
      this.deletingId = id
      api.delete('/products/' + id).then(() => {
        this.success = 'Producto eliminado'
        this.loadProducts()
      }).catch(err => {
        this.error = err.userMessage
      }).finally(() => {
        this.deletingId = null
      })
    }
  }
}
</script>
