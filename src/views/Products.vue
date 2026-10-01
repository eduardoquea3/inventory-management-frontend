<template>
  <div class="space-y-6">
    <header class="flex flex-wrap items-end justify-between gap-4 border-b border-[#d8d5ca] pb-5">
      <div>
        <p class="mb-2 font-utility text-[9px] font-semibold uppercase tracking-[.15em] text-steel">Inventory <span class="px-1 text-safety-amber">/</span> Catalog</p>
        <h2 class="m-0 font-display text-[clamp(30px,4vw,42px)] font-semibold leading-none tracking-[-.03em] text-graphite">Productos</h2>
        <p class="mb-0 mt-3 text-sm text-[#6f786e]">Busca, filtra y administra el inventario.</p>
      </div>
      <router-link to="/products/new" class="inline-flex min-h-11 items-center justify-between gap-8 bg-graphite px-4 text-sm font-semibold text-clean-label no-underline transition hover:bg-forest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-safety-amber">
        <span>Nuevo producto</span><span class="text-lg text-safety-amber" aria-hidden="true">+</span>
      </router-link>
    </header>

    <section class="border border-[#d9d8cf] bg-clean-label p-4 sm:p-5" aria-label="Filtros de productos">
      <div class="mb-4 flex items-center gap-2 font-utility text-[8px] font-semibold uppercase tracking-[.14em] text-steel"><span class="size-1.5 bg-safety-amber" aria-hidden="true"></span> Buscar en el catálogo</div>
      <div class="grid gap-3 sm:grid-cols-[minmax(180px,1.5fr)_minmax(150px,1fr)_minmax(140px,.8fr)_auto] sm:items-end">
        <label class="grid gap-1.5 font-utility text-[8px] font-semibold uppercase tracking-[.1em] text-[#697267]">Nombre o referencia
          <input v-model="q" placeholder="Buscar producto" :disabled="loading" @keyup.enter="applyFilters" class="h-11 w-full border border-[#c9cdc2] bg-white px-3 font-body text-sm font-normal normal-case tracking-normal text-graphite outline-none transition placeholder:text-[#9ba197] focus:border-forest focus:ring-2 focus:ring-forest/15 disabled:bg-[#f2f0e8]" />
        </label>
        <label class="grid gap-1.5 font-utility text-[8px] font-semibold uppercase tracking-[.1em] text-[#697267]">Categoría
          <select v-model="category_id" :disabled="loading" @change="applyFilters" class="h-11 w-full border border-[#c9cdc2] bg-white px-3 font-body text-sm font-normal normal-case tracking-normal text-graphite outline-none focus:border-forest focus:ring-2 focus:ring-forest/15 disabled:bg-[#f2f0e8]">
            <option value="">Todas las categorías</option>
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </label>
        <label class="grid gap-1.5 font-utility text-[8px] font-semibold uppercase tracking-[.1em] text-[#697267]">Estado
          <select v-model="status" :disabled="loading" @change="applyFilters" aria-label="Filtrar por estado" class="h-11 w-full border border-[#c9cdc2] bg-white px-3 font-body text-sm font-normal normal-case tracking-normal text-graphite outline-none focus:border-forest focus:ring-2 focus:ring-forest/15 disabled:bg-[#f2f0e8]">
            <option value="">Todos los estados</option>
            <option value="1">Activos</option>
            <option value="0">Inactivos</option>
          </select>
        </label>
        <button :disabled="loading" @click="applyFilters" class="h-11 border border-forest bg-forest px-5 text-sm font-semibold text-clean-label transition hover:bg-graphite disabled:cursor-wait disabled:opacity-60">{{ loading ? 'Buscando...' : 'Buscar' }}</button>
      </div>
    </section>

    <p v-if="loading" class="flex items-center gap-3 border border-[#d9d8cf] bg-clean-label px-4 py-3 text-sm text-steel" role="status"><span class="size-2 animate-pulse rounded-full bg-safety-amber motion-reduce:animate-none"></span> Cargando productos...</p>
    <p v-if="error" class="border-l-2 border-red-700 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{{ error }}</p>
    <p v-if="categoryError" class="border-l-2 border-red-700 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{{ categoryError }}</p>
    <p v-if="success" class="border-l-2 border-forest bg-[#edf2eb] px-4 py-3 text-sm text-forest" role="status">{{ success }}</p>
    <section v-if="!loading && !error && products.length === 0" class="border border-dashed border-[#c9cdc2] bg-clean-label px-6 py-12 text-center">
      <span class="mx-auto grid size-10 place-items-center border border-[#d9d8cf] font-utility text-lg text-forest" aria-hidden="true">▤</span>
      <h3 class="mb-1 mt-4 font-display text-xl font-bold text-graphite">No se encontraron productos</h3>
      <p class="m-0 text-sm text-steel">Prueba con otros filtros o registra un producto nuevo.</p>
    </section>

    <section v-if="products.length > 0" class="overflow-hidden border border-[#d9d8cf] bg-clean-label" aria-label="Lista de productos">
      <div class="flex flex-wrap items-center justify-between gap-2 border-b border-[#d9d8cf] px-4 py-3 sm:px-5">
        <p class="m-0 font-utility text-[8px] font-semibold uppercase tracking-[.12em] text-steel">Product register</p>
        <span class="font-utility text-[9px] tabular-nums text-[#727c70]">{{ pagination.total }} registros</span>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full min-w-[760px] border-collapse text-left">
          <thead class="bg-[#f2f0e8]">
            <tr class="font-utility text-[8px] font-semibold uppercase tracking-[.12em] text-[#737c71]">
              <th class="px-4 py-3 font-semibold sm:px-5">ID</th><th class="px-4 py-3 font-semibold sm:px-5">Nombre</th><th class="px-4 py-3 font-semibold sm:px-5">Categoría</th><th class="px-4 py-3 text-right font-semibold sm:px-5">Precio</th><th class="px-4 py-3 text-right font-semibold sm:px-5">Stock</th><th class="px-4 py-3 text-right font-semibold sm:px-5">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#e5e3da]">
            <tr v-for="p in products" :key="p.id" class="text-sm transition-colors hover:bg-[#f8f7f2]">
              <td class="px-4 py-3.5 font-utility text-[10px] tabular-nums text-[#858d82] sm:px-5">{{ p.id }}</td>
              <td class="px-4 py-3.5 font-semibold text-graphite sm:px-5">{{ p.name }}</td>
              <td class="px-4 py-3.5 text-[#6f786e] sm:px-5">{{ p.category ? p.category.name : '-' }}</td>
              <td class="px-4 py-3.5 text-right font-utility text-xs tabular-nums text-graphite sm:px-5">{{ p.price }}</td>
              <td class="px-4 py-3.5 text-right font-utility text-xs font-semibold tabular-nums text-graphite sm:px-5">{{ p.stock }}</td>
              <td class="px-4 py-3.5 sm:px-5">
                <div class="flex items-center justify-end gap-2">
                  <router-link :to="'/products/' + p.id + '/edit'" class="border border-[#d9d8cf] px-2.5 py-1.5 text-xs font-medium text-graphite no-underline transition hover:border-forest hover:text-forest">Editar</router-link>
                  <router-link :to="'/products/' + p.id + '/stock'" class="border border-[#d9d8cf] px-2.5 py-1.5 text-xs font-medium text-graphite no-underline transition hover:border-forest hover:text-forest">Stock</router-link>
                  <button :disabled="deletingId === p.id" @click="remove(p.id)" class="px-2 py-1.5 text-xs font-medium text-[#925347] transition hover:bg-[#f8eae5] disabled:opacity-50">{{ deletingId === p.id ? 'Eliminando...' : 'Eliminar' }}</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div v-if="pagination.lastPage > 1 || products.length > 0" class="flex flex-wrap items-center justify-between gap-3 border-t border-[#d8d5ca] pt-4">
      <p class="m-0 font-utility text-[9px] tabular-nums text-steel">Página {{ pagination.currentPage }} de {{ pagination.lastPage }} <span class="px-1 text-[#b0b5aa]">·</span> {{ pagination.total }} productos</p>
      <div class="flex flex-wrap items-center gap-2">
        <label class="mr-1 flex items-center gap-2 font-utility text-[8px] font-semibold uppercase tracking-[.08em] text-steel">Por página
          <select v-model.number="perPage" :disabled="loading" @change="changePageSize" class="h-9 border border-[#c9cdc2] bg-clean-label px-2 font-body text-xs font-normal tracking-normal text-graphite disabled:opacity-60">
            <option :value="10">10</option><option :value="25">25</option><option :value="50">50</option>
          </select>
        </label>
        <button :disabled="loading || pagination.currentPage <= 1" @click="changePage(pagination.currentPage - 1)" class="h-9 border border-[#c9cdc2] bg-clean-label px-3 text-xs font-medium text-graphite transition hover:border-forest disabled:cursor-not-allowed disabled:opacity-40">Anterior</button>
        <button :disabled="loading || pagination.currentPage >= pagination.lastPage" @click="changePage(pagination.currentPage + 1)" class="h-9 border border-[#c9cdc2] bg-clean-label px-3 text-xs font-medium text-graphite transition hover:border-forest disabled:cursor-not-allowed disabled:opacity-40">Siguiente</button>
      </div>
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
