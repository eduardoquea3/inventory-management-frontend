<template>
  <main class="container">
    <header class="page-heading">
      <div>
        <p class="eyebrow">Warehouse <span>/</span> Overview</p>
        <h1>Dashboard</h1>
      </div>
      <div class="page-heading__rule hidden sm:block"></div>
    </header>

    <p v-if="loading" class="mb-5 flex items-center gap-3 border border-[#d9d8cf] bg-clean-label px-4 py-3 text-sm text-steel" role="status">
      <span class="size-2 animate-pulse rounded-full bg-safety-amber motion-reduce:animate-none"></span> Cargando...
    </p>
    <p v-if="error" class="mb-5 border-l-2 border-red-700 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{{ error }}</p>

    <section class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-label="Inventory summary">
      <article class="relative min-h-36 overflow-hidden border border-[#d9d8cf] bg-clean-label p-5">
        <span class="absolute inset-y-0 left-0 w-1 bg-forest"></span>
        <p class="font-utility text-[10px] font-semibold uppercase tracking-[.13em] text-steel">Productos</p>
        <p class="mt-5 font-display text-4xl font-bold leading-none text-graphite">{{ data.products }}</p>
      </article>
      <article class="relative min-h-36 overflow-hidden border border-[#d9d8cf] bg-clean-label p-5">
        <span class="absolute inset-y-0 left-0 w-1 bg-steel"></span>
        <p class="font-utility text-[10px] font-semibold uppercase tracking-[.13em] text-steel">Categorías</p>
        <p class="mt-5 font-display text-4xl font-bold leading-none text-graphite">{{ data.categories }}</p>
      </article>
      <article class="relative min-h-36 overflow-hidden border border-[#d9d8cf] bg-clean-label p-5 sm:col-span-2 xl:col-span-1">
        <span class="absolute inset-y-0 left-0 w-1 bg-safety-amber"></span>
        <p class="font-utility text-[10px] font-semibold uppercase tracking-[.13em] text-steel">Bajo stock</p>
        <p class="mt-5 font-display text-4xl font-bold leading-none text-graphite">{{ data.low_stock ? data.low_stock.length : 0 }}</p>
      </article>
    </section>

    <section class="mt-8 border border-[#d9d8cf] bg-clean-label">
      <header class="flex items-center justify-between border-b border-[#d9d8cf] px-5 py-4">
        <div>
          <p class="mb-1 font-utility text-[9px] uppercase tracking-[.14em] text-steel">Activity log</p>
          <h2 class="font-display text-xl font-bold text-graphite">Últimos movimientos</h2>
        </div>
        <span class="hidden border border-[#deddd4] px-2 py-1 font-utility text-[9px] uppercase tracking-wider text-steel sm:inline">Recent</span>
      </header>
      <ul class="divide-y divide-[#e5e3da]">
        <li v-for="m in data.last_movements" :key="m.id" class="grid gap-2 px-5 py-4 sm:grid-cols-[minmax(90px,.4fr)_minmax(100px,.35fr)_1fr] sm:items-center">
          <span class="inline-flex w-fit items-center gap-2 border border-[#d9d8cf] px-2 py-1 font-utility text-[10px] uppercase tracking-wide text-forest before:size-1.5 before:bg-safety-amber">{{ m.type }}</span>
          <span class="font-utility text-xs text-graphite">{{ m.quantity }}</span>
          <span class="text-sm text-steel">{{ m.reason }}</span>
        </li>
      </ul>
    </section>
  </main>
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
