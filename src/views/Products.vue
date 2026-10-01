<template>
  <div class="container">
    <h1>Productos</h1>
    <router-link to="/products/new">Nuevo producto</router-link>

    <div class="card">
      <input v-model="q" placeholder="Buscar producto" :disabled="loading" @keyup.enter="applyFilters" />
      <select v-model="category_id" :disabled="loading" @change="applyFilters">
        <option value="">Todas las categorías</option>
        <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>
      <select v-model="status" :disabled="loading" @change="applyFilters" aria-label="Filtrar por estado">
        <option value="">Todos los estados</option>
        <option value="1">Activos</option>
        <option value="0">Inactivos</option>
      </select>
      <button :disabled="loading" @click="applyFilters">{{ loading ? 'Buscando...' : 'Buscar' }}</button>
    </div>

    <p v-if="loading" role="status">Cargando productos...</p>
    <p class="error" v-if="error" role="alert">{{ error }}</p>
    <p class="error" v-if="categoryError" role="alert">{{ categoryError }}</p>
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

    <div v-if="pagination.lastPage > 1 || products.length > 0" class="pagination">
      <button :disabled="loading || pagination.currentPage <= 1" @click="changePage(pagination.currentPage - 1)">Anterior</button>
      <span>Página {{ pagination.currentPage }} de {{ pagination.lastPage }} ({{ pagination.total }} productos)</span>
      <button :disabled="loading || pagination.currentPage >= pagination.lastPage" @click="changePage(pagination.currentPage + 1)">Siguiente</button>
      <label>Por página
        <select v-model.number="perPage" :disabled="loading" @change="changePageSize">
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
        </select>
      </label>
    </div>
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
      categoryError: '',
      success: '',
      q: '',
      category_id: '',
      status: '',
      page: 1,
      perPage: 10,
      pagination: { currentPage: 1, lastPage: 1, total: 0 },
      deletingId: null
    }
  },
  mounted() {
    this.loadCategories()
    this.loadProducts()
  },
  methods: {
    async loadCategories() {
      this.categoryError = ''
      try {
        const first = await api.get('/categories', { params: { page: 1, per_page: 15 } })
        const { data, meta } = first.data
        const categories = [...data]
        for (let page = 2; page <= Number(meta.last_page); page++) {
          const response = await api.get('/categories', { params: { page, per_page: 15 } })
          categories.push(...response.data.data)
        }
        this.categories = categories
      } catch (err) {
        this.categoryError = err.userMessage || 'No se pudieron cargar las categorías.'
      }
    },
    applyFilters() {
      this.page = 1
      this.loadProducts()
    },
    changePage(page) {
      this.page = page
      this.loadProducts()
    },
    changePageSize() {
      this.page = 1
      this.loadProducts()
    },
    async loadProducts() {
      if (this.loading) return
      this.loading = true
      this.error = ''
      this.success = ''
      try {
        for (let attempt = 0; attempt < 2; attempt++) {
          const requestedPage = this.page
          const params = new URLSearchParams({ page: String(requestedPage), per_page: String(this.perPage) })
          if (this.q) params.set('q', this.q)
          if (this.category_id !== '') params.set('category_id', String(this.category_id))
          if (this.status !== '') params.set('status', this.status)
          const res = await api.get('/products?' + params.toString())
          const { data, meta } = res.data
          const lastPage = Math.max(1, Number(meta.last_page) || 1)
          if (requestedPage > lastPage && attempt === 0) {
            this.page = lastPage
            continue
          }
          this.products = data
          this.pagination = { currentPage: meta.current_page, lastPage, total: meta.total }
          this.page = Math.min(Number(meta.current_page) || 1, lastPage)
          break
        }
      } catch (err) {
        this.error = err.userMessage
      } finally {
        this.loading = false
      }
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
