<template>
  <main class="mx-auto max-w-[1040px] space-y-6 pb-10">
    <header class="flex flex-wrap items-end justify-between gap-4 border-b border-[#d8d5ca] pb-5">
      <div>
        <p class="mb-2 font-utility text-[9px] font-semibold uppercase tracking-[.15em] text-steel">Inventory <span class="px-1 text-safety-amber">/</span> Products</p>
        <h2 class="m-0 font-display text-[clamp(30px,4vw,42px)] font-semibold leading-none tracking-[-.03em] text-graphite">{{ isEdit ? 'Editar producto' : 'Nuevo producto' }}</h2>
        <p class="mb-0 mt-3 text-sm text-[#6f786e]">{{ isEdit ? 'Actualiza los datos de este artículo.' : 'Añade un artículo al inventario.' }}</p>
      </div>
      <router-link to="/products" class="inline-flex h-10 items-center gap-2 border border-[#c9cdc2] bg-clean-label px-3 text-xs font-semibold text-graphite no-underline transition hover:border-forest hover:text-forest"><span aria-hidden="true">←</span> Volver a productos</router-link>
    </header>

    <p v-if="loadingProduct" class="flex items-center gap-3 border border-[#d9d8cf] bg-clean-label px-4 py-3 text-sm text-steel" role="status"><span class="size-2 animate-pulse rounded-full bg-safety-amber motion-reduce:animate-none"></span> Cargando producto...</p>
    <p v-if="loading" class="flex items-center gap-3 border border-[#d9d8cf] bg-clean-label px-4 py-3 text-sm text-steel" role="status"><span class="size-2 animate-pulse rounded-full bg-safety-amber motion-reduce:animate-none"></span> Guardando...</p>
    <p v-if="error" class="border-l-2 border-red-700 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{{ error }}</p>
    <p v-if="success" class="border-l-2 border-forest bg-[#edf2eb] px-4 py-3 text-sm text-forest" role="status">{{ success }}</p>

    <section v-if="!loadingProduct" class="overflow-hidden border border-[#d9d8cf] bg-clean-label">
      <div class="flex items-center gap-3 border-b border-[#d9d8cf] px-5 py-4 sm:px-7">
        <span class="grid size-9 place-items-center border border-[#d9d8cf] font-utility text-sm text-forest" aria-hidden="true">▤</span>
        <div><p class="mb-0.5 font-utility text-[8px] font-semibold uppercase tracking-[.13em] text-steel">Product record</p><h3 class="m-0 font-display text-lg font-bold text-graphite">Datos del producto</h3></div>
      </div>
      <div class="grid gap-x-6 gap-y-5 p-5 sm:grid-cols-2 sm:p-7">
        <label for="product-name" class="grid gap-2 font-utility text-[9px] font-semibold uppercase tracking-[.1em] text-[#596357] sm:col-span-2">Nombre del producto <span class="text-safety-amber">Obligatorio</span>
          <input id="product-name" v-model.trim="form.name" placeholder="Nombre" required class="h-11 w-full border border-[#c9cdc2] bg-white px-3 font-body text-sm font-normal normal-case tracking-normal text-graphite outline-none transition placeholder:text-[#9ba197] focus:border-forest focus:ring-2 focus:ring-forest/15" />
        </label>
        <label for="product-description" class="grid gap-2 font-utility text-[9px] font-semibold uppercase tracking-[.1em] text-[#596357] sm:col-span-2">Descripción
          <textarea id="product-description" v-model="form.description" placeholder="Descripción" rows="4" class="w-full resize-y border border-[#c9cdc2] bg-white px-3 py-2.5 font-body text-sm font-normal normal-case leading-6 tracking-normal text-graphite outline-none transition placeholder:text-[#9ba197] focus:border-forest focus:ring-2 focus:ring-forest/15"></textarea>
        </label>
        <label for="product-price" class="grid gap-2 font-utility text-[9px] font-semibold uppercase tracking-[.1em] text-[#596357]">Precio
          <input id="product-price" v-model.number="form.price" type="number" step="any" placeholder="Precio" class="h-11 w-full border border-[#c9cdc2] bg-white px-3 font-utility text-sm font-normal tracking-normal text-graphite outline-none transition placeholder:font-body placeholder:text-[#9ba197] focus:border-forest focus:ring-2 focus:ring-forest/15" />
        </label>
        <label for="product-stock" class="grid gap-2 font-utility text-[9px] font-semibold uppercase tracking-[.1em] text-[#596357]">Stock
          <input id="product-stock" v-model.number="form.stock" type="number" step="any" placeholder="Stock" class="h-11 w-full border border-[#c9cdc2] bg-white px-3 font-utility text-sm font-normal tracking-normal text-graphite outline-none transition placeholder:font-body placeholder:text-[#9ba197] focus:border-forest focus:ring-2 focus:ring-forest/15" />
        </label>
        <label for="product-category" class="grid gap-2 font-utility text-[9px] font-semibold uppercase tracking-[.1em] text-[#596357]">Categoría
          <select id="product-category" v-model="form.category_id" class="h-11 w-full border border-[#c9cdc2] bg-white px-3 font-body text-sm font-normal normal-case tracking-normal text-graphite outline-none focus:border-forest focus:ring-2 focus:ring-forest/15">
            <option value="">Seleccione categoría</option>
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </label>
        <label for="product-status" class="grid gap-2 font-utility text-[9px] font-semibold uppercase tracking-[.1em] text-[#596357]">Estado
          <select id="product-status" v-model="form.status" class="h-11 w-full border border-[#c9cdc2] bg-white px-3 font-body text-sm font-normal normal-case tracking-normal text-graphite outline-none focus:border-forest focus:ring-2 focus:ring-forest/15">
            <option :value="1">Activo</option>
            <option :value="0">Inactivo</option>
          </select>
        </label>
      </div>
      <footer class="flex flex-wrap items-center justify-between gap-3 border-t border-[#d9d8cf] bg-[#f7f6f0] px-5 py-4 sm:px-7">
        <p class="m-0 font-utility text-[8px] uppercase tracking-[.1em] text-steel"><span class="text-safety-amber">◆</span> Los campos se guardan en el inventario</p>
        <button :disabled="loading || loadingProduct" @click="save" class="inline-flex min-h-11 items-center gap-6 bg-graphite px-4 text-sm font-semibold text-clean-label transition hover:bg-forest disabled:cursor-wait disabled:opacity-60"><span>{{ loading ? 'Guardando...' : 'Guardar producto' }}</span><span class="text-safety-amber" aria-hidden="true">→</span></button>
      </footer>
    </section>
  </main>
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
