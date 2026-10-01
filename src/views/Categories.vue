<template>
  <div class="container">
    <h1>Categorías</h1>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <p v-if="success" class="success" role="status">{{ success }}</p>

    <form class="card" @submit.prevent="save">
      <label for="category-name">Nombre</label>
      <input
        id="category-name"
        v-model="form.name"
        name="name"
        placeholder="Nombre categoría"
        required
        :disabled="saving"
        @input="clearMessages"
      />

      <label for="category-description">Descripción</label>
      <input
        id="category-description"
        v-model="form.description"
        name="description"
        placeholder="Descripción"
        :disabled="saving"
        @input="clearMessages"
      />

      <div>
        <button type="submit" :disabled="saving || loading">
          {{ saving ? 'Guardando…' : form.id ? 'Actualizar categoría' : 'Guardar categoría' }}
        </button>
        <button v-if="form.id" type="button" :disabled="saving" @click="resetForm">
          Cancelar edición
        </button>
      </div>
    </form>

    <p v-if="loading" role="status">Cargando categorías…</p>
    <p v-else-if="!error && categories.length === 0">Todavía no hay categorías.</p>

    <table v-if="categories.length > 0">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="category in categories" :key="category.id">
          <td>{{ category.id }}</td>
          <td>{{ category.name }}</td>
          <td>{{ category.status }}</td>
          <td>
            <button type="button" :disabled="saving || deletingId !== null" @click="edit(category)">
              Editar
            </button>
            <button
              type="button"
              :disabled="saving || deletingId !== null"
              @click="remove(category.id)"
            >
              {{ deletingId === category.id ? 'Eliminando…' : 'Eliminar' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="pagination.lastPage > 1 || categories.length > 0" class="pagination">
      <button type="button" :disabled="loading || pagination.currentPage <= 1" @click="changePage(pagination.currentPage - 1)">Anterior</button>
      <span>Página {{ pagination.currentPage }} de {{ pagination.lastPage }} ({{ pagination.total }} categorías)</span>
      <button type="button" :disabled="loading || pagination.currentPage >= pagination.lastPage" @click="changePage(pagination.currentPage + 1)">Siguiente</button>
      <label>Por página
        <select v-model.number="perPage" :disabled="loading" @change="changePageSize">
          <option :value="15">15</option>
          <option :value="30">30</option>
          <option :value="50">50</option>
        </select>
      </label>
    </div>
  </div>
</template>

<script>
import api from '../api'

const emptyForm = () => ({ id: null, name: '', description: '', status: 1 })

export default {
  data() {
    return {
      categories: [],
      page: 1,
      perPage: 15,
      pagination: { currentPage: 1, lastPage: 1, total: 0 },
      form: emptyForm(),
      loading: false,
      saving: false,
      deletingId: null,
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
    changePage(page) {
      this.page = page
      this.load()
    },
    changePageSize() {
      this.page = 1
      this.load()
    },
    async load() {
      if (this.loading) return
      this.loading = true
      this.error = ''
      try {
        for (let attempt = 0; attempt < 2; attempt++) {
          const requestedPage = this.page
          const response = await api.get('/categories', {
            params: { page: requestedPage, per_page: this.perPage }
          })
          const { data, meta } = response.data
          const lastPage = Math.max(1, Number(meta.last_page) || 1)
          if (requestedPage > lastPage && attempt === 0) {
            this.page = lastPage
            continue
          }
          this.categories = data
          this.pagination = {
            currentPage: meta.current_page,
            lastPage,
            total: meta.total
          }
          this.page = Math.min(Number(meta.current_page) || 1, lastPage)
          break
        }
      } catch (error) {
        this.error = error.userMessage
      } finally {
        this.loading = false
      }
    },
    edit(category) {
      this.clearMessages()
      this.form = { ...category }
    },
    resetForm() {
      this.form = emptyForm()
      this.clearMessages()
    },
    async save() {
      this.clearMessages()
      if (!this.form.name.trim()) {
        this.error = 'El nombre es obligatorio.'
        return
      }

      const editing = Boolean(this.form.id)
      const url = '/categories' + (editing ? '/' + this.form.id : '')
      const method = editing ? 'put' : 'post'
      const data = { ...this.form, name: this.form.name.trim() }

      this.saving = true
      try {
        await api({ method, url, data })
        this.success = editing ? 'Categoría actualizada.' : 'Categoría creada.'
        this.form = emptyForm()
        await this.load()
      } catch (error) {
        this.error = error.userMessage
      } finally {
        this.saving = false
      }
    },
    async remove(id) {
      if (!window.confirm('¿Querés eliminar esta categoría?')) return

      this.clearMessages()
      this.deletingId = id
      try {
        await api.delete('/categories/' + id)
        this.success = 'Categoría eliminada.'
        await this.load()
      } catch (error) {
        this.error = error.userMessage
      } finally {
        this.deletingId = null
      }
    }
  }
}
</script>
