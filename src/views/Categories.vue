<template>
  <main class="space-y-6 pb-10">
    <header class="flex flex-wrap items-end justify-between gap-4 border-b border-[#d8d5ca] pb-5">
      <div>
        <p class="mb-2 font-utility text-[9px] font-semibold uppercase tracking-[.15em] text-steel">Inventory <span class="px-1 text-safety-amber">/</span> Organization</p>
        <h2 class="m-0 font-display text-[clamp(30px,4vw,42px)] font-semibold leading-none tracking-[-.03em] text-graphite">Categorías</h2>
        <p class="mb-0 mt-3 text-sm text-[#6f786e]">Organiza los productos por familia.</p>
      </div>
      <span class="inline-flex items-center gap-2 border border-[#d9d8cf] bg-clean-label px-3 py-2 font-utility text-[8px] font-semibold uppercase tracking-[.1em] text-[#687266]"><span class="size-1.5 bg-safety-amber" aria-hidden="true"></span> {{ pagination.total }} categorías</span>
    </header>

    <p v-if="error" class="border-l-2 border-red-700 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{{ error }}</p>
    <p v-if="success" class="border-l-2 border-forest bg-[#edf2eb] px-4 py-3 text-sm text-forest" role="status">{{ success }}</p>

    <form class="border border-[#d9d8cf] bg-clean-label p-4 sm:p-5" aria-label="Filtros de categorías" @submit.prevent="applyFilters">
      <div class="mb-4 flex items-center gap-2 font-utility text-[8px] font-semibold uppercase tracking-[.14em] text-steel"><span class="size-1.5 bg-safety-amber" aria-hidden="true"></span> Buscar en categorías</div>
      <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(180px,1.5fr)_minmax(140px,.8fr)_minmax(160px,1fr)_minmax(140px,.8fr)_auto] xl:items-end">
        <label class="grid gap-1.5 font-utility text-[8px] font-semibold uppercase tracking-[.1em] text-[#697267]">Nombre de categoría
          <input v-model="q" placeholder="Buscar por nombre" :disabled="loading" class="h-11 w-full border border-[#c9cdc2] bg-white px-3 font-body text-sm font-normal normal-case tracking-normal text-graphite outline-none transition placeholder:text-[#9ba197] focus:border-forest focus:ring-2 focus:ring-forest/15 disabled:bg-[#f2f0e8]" />
        </label>
        <label class="grid gap-1.5 font-utility text-[8px] font-semibold uppercase tracking-[.1em] text-[#697267]">Estado
          <select v-model="statusFilter" :disabled="loading" class="h-11 w-full border border-[#c9cdc2] bg-white px-3 font-body text-sm font-normal normal-case tracking-normal text-graphite outline-none focus:border-forest focus:ring-2 focus:ring-forest/15 disabled:bg-[#f2f0e8]">
            <option value="">Todos los estados</option><option value="1">Activas</option><option value="0">Inactivas</option>
          </select>
        </label>
        <label class="grid gap-1.5 font-utility text-[8px] font-semibold uppercase tracking-[.1em] text-[#697267]">Ordenar por
          <select v-model="sort_by" :disabled="loading" class="h-11 w-full border border-[#c9cdc2] bg-white px-3 font-body text-sm font-normal normal-case tracking-normal text-graphite outline-none focus:border-forest focus:ring-2 focus:ring-forest/15 disabled:bg-[#f2f0e8]">
            <option value="">Orden predeterminado</option><option value="created_at">Fecha de creación</option><option value="name">Nombre</option>
          </select>
        </label>
        <label class="grid gap-1.5 font-utility text-[8px] font-semibold uppercase tracking-[.1em] text-[#697267]">Dirección
          <select v-model="sort_direction" :disabled="loading || !sort_by" class="h-11 w-full border border-[#c9cdc2] bg-white px-3 font-body text-sm font-normal normal-case tracking-normal text-graphite outline-none focus:border-forest focus:ring-2 focus:ring-forest/15 disabled:bg-[#f2f0e8]">
            <option value="asc">Ascendente</option><option value="desc">Descendente</option>
          </select>
        </label>
        <div class="flex items-end gap-2 sm:col-span-2 xl:col-span-1">
          <button type="button" :disabled="loading" @click="resetFilters" class="h-11 border border-[#c9cdc2] bg-transparent px-4 text-xs font-semibold text-[#626b60] transition hover:border-graphite hover:text-graphite disabled:opacity-50">Limpiar</button>
          <button type="submit" :disabled="loading" class="h-11 border border-forest bg-forest px-5 text-sm font-semibold text-clean-label transition hover:bg-graphite disabled:cursor-wait disabled:opacity-60">{{ loading ? 'Buscando…' : 'Buscar' }}</button>
        </div>
      </div>
    </form>

    <div class="grid items-start gap-5 xl:grid-cols-[minmax(260px,.72fr)_minmax(0,1.5fr)]">
      <section class="overflow-hidden border border-[#d9d8cf] bg-clean-label">
        <header class="flex items-center gap-3 border-b border-[#d9d8cf] px-5 py-4">
          <span class="grid size-9 place-items-center border border-[#d9d8cf] font-utility text-sm text-forest" aria-hidden="true">◫</span>
          <div><p class="mb-0.5 font-utility text-[8px] font-semibold uppercase tracking-[.13em] text-steel">Category record</p><h3 class="m-0 font-display text-lg font-bold text-graphite">{{ form.id ? 'Editar categoría' : 'Nueva categoría' }}</h3></div>
        </header>
        <form class="grid gap-5 p-5" @submit.prevent="save">
          <label for="category-name" class="grid gap-2 font-utility text-[9px] font-semibold uppercase tracking-[.1em] text-[#596357]">Nombre <span class="text-safety-amber">Obligatorio</span>
            <input id="category-name" v-model="form.name" name="name" placeholder="Nombre categoría" required :disabled="saving" @input="clearMessages" class="h-11 w-full border border-[#c9cdc2] bg-white px-3 font-body text-sm font-normal normal-case tracking-normal text-graphite outline-none transition placeholder:text-[#9ba197] focus:border-forest focus:ring-2 focus:ring-forest/15 disabled:bg-[#f2f0e8]" />
          </label>

          <label for="category-description" class="grid gap-2 font-utility text-[9px] font-semibold uppercase tracking-[.1em] text-[#596357]">Descripción
            <input id="category-description" v-model="form.description" name="description" placeholder="Descripción" :disabled="saving" @input="clearMessages" class="h-11 w-full border border-[#c9cdc2] bg-white px-3 font-body text-sm font-normal normal-case tracking-normal text-graphite outline-none transition placeholder:text-[#9ba197] focus:border-forest focus:ring-2 focus:ring-forest/15 disabled:bg-[#f2f0e8]" />
          </label>

          <div class="grid gap-2 border-t border-[#e5e3da] pt-4">
            <button type="submit" :disabled="saving || loading" class="flex min-h-11 items-center justify-between bg-graphite px-4 text-sm font-semibold text-clean-label transition hover:bg-forest disabled:cursor-wait disabled:opacity-60"><span>{{ saving ? 'Guardando…' : form.id ? 'Actualizar categoría' : 'Guardar categoría' }}</span><span class="text-safety-amber" aria-hidden="true">→</span></button>
            <button v-if="form.id" type="button" :disabled="saving" @click="resetForm" class="min-h-10 border border-[#c9cdc2] bg-transparent px-4 text-xs font-semibold text-[#626b60] transition hover:border-graphite hover:text-graphite disabled:opacity-50">Cancelar edición</button>
          </div>
        </form>
      </section>

      <section class="overflow-hidden border border-[#d9d8cf] bg-clean-label" aria-labelledby="categories-list-title" :aria-busy="loading">
        <header class="flex flex-wrap items-center justify-between gap-3 border-b border-[#d9d8cf] px-5 py-4">
          <div><p class="mb-0.5 font-utility text-[8px] font-semibold uppercase tracking-[.13em] text-steel">Category index</p><h3 id="categories-list-title" class="m-0 font-display text-lg font-bold text-graphite">Familias de productos</h3></div>
          <span class="font-utility text-[9px] tabular-nums text-[#727c70]">{{ pagination.total }} registros</span>
        </header>
        <p v-if="loading" class="flex items-center gap-3 px-5 py-8 text-sm text-steel" role="status"><span class="size-2 animate-pulse rounded-full bg-safety-amber motion-reduce:animate-none"></span> Cargando categorías…</p>
        <p v-else-if="!error && categories.length === 0" class="m-0 px-5 py-12 text-center text-sm text-steel">Todavía no hay categorías.</p>
        <div v-else-if="categories.length > 0" class="overflow-x-auto">
          <table class="w-full min-w-[520px] border-collapse text-left">
            <thead class="bg-[#f2f0e8]"><tr class="font-utility text-[8px] font-semibold uppercase tracking-[.12em] text-[#737c71]"><th class="px-4 py-3 font-semibold">ID</th><th class="px-4 py-3 font-semibold">Nombre</th><th class="px-4 py-3 font-semibold">Estado</th><th class="px-4 py-3 text-right font-semibold">Acciones</th></tr></thead>
            <tbody class="divide-y divide-[#e5e3da]">
              <tr v-for="category in categories" :key="category.id" class="text-sm transition-colors hover:bg-[#f8f7f2]">
                <td class="px-4 py-3.5 font-utility text-[10px] tabular-nums text-[#858d82]">{{ category.id }}</td>
                <td class="px-4 py-3.5 font-semibold text-graphite">{{ category.name }}</td>
                <td class="px-4 py-3.5"><span class="inline-flex items-center gap-2 border px-2 py-1 font-utility text-[8px] font-semibold uppercase tracking-[.08em]" :class="Number(category.status) === 1 ? 'border-[#cbd8c9] bg-[#edf2eb] text-forest' : 'border-[#d9d8cf] bg-[#f2f0e8] text-[#737c71]'"><span class="size-1.5 rounded-full" :class="Number(category.status) === 1 ? 'bg-forest' : 'bg-[#9ca49a]'" aria-hidden="true"></span>{{ Number(category.status) === 1 ? 'Activa' : 'Inactiva' }}</span></td>
                <td class="px-4 py-3.5"><div class="flex items-center justify-end gap-2">
                  <button type="button" :disabled="saving || deletingId !== null" @click="edit(category)" class="border border-[#d9d8cf] px-2.5 py-1.5 text-xs font-medium text-graphite transition hover:border-forest hover:text-forest disabled:opacity-50">Editar</button>
                  <button type="button" :disabled="saving || deletingId !== null" @click="remove(category.id)" class="px-2 py-1.5 text-xs font-medium text-[#925347] transition hover:bg-[#f8eae5] disabled:opacity-50">{{ deletingId === category.id ? 'Eliminando…' : 'Eliminar' }}</button>
                </div></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <div v-if="pagination.lastPage > 1 || categories.length > 0" class="flex flex-wrap items-center justify-between gap-3 border-t border-[#d8d5ca] pt-4">
      <p class="m-0 font-utility text-[9px] tabular-nums text-steel">Página {{ pagination.currentPage }} de {{ pagination.lastPage }} <span class="px-1 text-[#b0b5aa]">·</span> {{ pagination.total }} categorías</p>
      <div class="flex flex-wrap items-center gap-2">
        <label class="mr-1 flex items-center gap-2 font-utility text-[8px] font-semibold uppercase tracking-[.08em] text-steel">Por página
          <select v-model.number="perPage" :disabled="loading" @change="changePageSize" class="h-9 border border-[#c9cdc2] bg-clean-label px-2 font-body text-xs font-normal tracking-normal text-graphite disabled:opacity-60"><option :value="15">15</option><option :value="30">30</option><option :value="50">50</option><option :value="100">100</option></select>
        </label>
        <button type="button" :disabled="loading || pagination.currentPage <= 1" @click="changePage(pagination.currentPage - 1)" class="h-9 border border-[#c9cdc2] bg-clean-label px-3 text-xs font-medium text-graphite transition hover:border-forest disabled:cursor-not-allowed disabled:opacity-40">Anterior</button>
        <button type="button" :disabled="loading || pagination.currentPage >= pagination.lastPage" @click="changePage(pagination.currentPage + 1)" class="h-9 border border-[#c9cdc2] bg-clean-label px-3 text-xs font-medium text-graphite transition hover:border-forest disabled:cursor-not-allowed disabled:opacity-40">Siguiente</button>
      </div>
    </div>
  </main>
</template>

<script>
import api from '../api'
import { buildCategoriesParams, readPaginatedResponse } from '../utils/catalogQuery'

const emptyForm = () => ({ id: null, name: '', description: '', status: 1 })

export default {
  data() {
    return {
      categories: [],
      page: 1,
      perPage: 15,
      q: '',
      statusFilter: '',
      sort_by: '',
      sort_direction: 'asc',
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
    applyFilters() {
      this.page = 1
      this.load()
    },
    resetFilters() {
      this.q = ''
      this.statusFilter = ''
      this.sort_by = ''
      this.sort_direction = 'asc'
      this.applyFilters()
    },
    async load() {
      if (this.loading) return
      this.loading = true
      this.error = ''
      try {
        for (let attempt = 0; attempt < 2; attempt++) {
          const requestedPage = this.page
          const params = buildCategoriesParams({
            page: requestedPage,
            perPage: this.perPage,
            q: this.q,
            status: this.statusFilter,
            sort_by: this.sort_by,
            sort_direction: this.sort_direction
          })
          const response = await api.get('/categories?' + params.toString())
          const result = readPaginatedResponse(response.data)
          const lastPage = result.pagination.lastPage
          if (requestedPage > lastPage && attempt === 0) {
            this.page = lastPage
            continue
          }
          this.categories = result.data
          this.pagination = {
            currentPage: result.pagination.currentPage,
            lastPage,
            total: result.pagination.total
          }
          this.page = Math.min(result.pagination.currentPage, lastPage)
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
