<template>
  <main class="mx-auto max-w-[1440px] pb-10">
    <header class="mb-7 flex flex-wrap items-end justify-between gap-5 border-b border-[#d8d5ca] pb-5 sm:mb-9 sm:pb-6">
      <div>
        <p class="mb-3 flex items-center gap-2 font-utility text-[9px] font-semibold uppercase tracking-[.16em] text-steel">
          <span class="size-1.5 bg-safety-amber" aria-hidden="true"></span> Warehouse operations <span class="text-[#c3c5bc]">/</span> Overview
        </p>
        <h2 class="m-0 font-display text-[clamp(34px,4vw,48px)] font-semibold leading-none tracking-[-.035em] text-graphite">Vista general</h2>
        <p class="mb-0 mt-3 max-w-lg text-sm leading-6 text-[#6f786e]">Estado del inventario y actividad reciente.</p>
      </div>
      <div class="mb-1 inline-flex items-center gap-2 border border-[#d9d8cf] bg-clean-label px-3 py-2 font-utility text-[8px] font-semibold uppercase tracking-[.12em] text-[#687266]">
        <span class="size-1.5 rounded-full bg-[#78946c] shadow-[0_0_0_3px_#e2e7dd]" aria-hidden="true"></span> Stock system <span class="text-[#a4aa9e]">·</span> Ready
      </div>
    </header>

    <p v-if="loading" class="mb-5 flex items-center gap-3 border border-[#d9d8cf] bg-clean-label px-4 py-3 text-sm text-steel" role="status">
      <span class="size-2 animate-pulse rounded-full bg-safety-amber motion-reduce:animate-none"></span> Cargando inventario...
    </p>
    <p v-if="error" class="mb-5 border-l-2 border-red-700 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{{ error }}</p>

    <section class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-label="Resumen del inventario">
      <article class="relative min-h-[170px] overflow-hidden border border-[#d9d8cf] bg-clean-label p-5 sm:p-6">
        <div class="flex items-start justify-between">
          <div><p class="mb-2 font-utility text-[9px] font-semibold uppercase tracking-[.14em] text-steel">Productos</p><p class="m-0 text-xs text-[#8a9086]">Total registrado</p></div>
          <span class="grid size-9 place-items-center border border-[#d9d8cf] font-utility text-sm text-forest" aria-hidden="true">▤</span>
        </div>
        <p class="mb-0 mt-7 font-display text-[clamp(38px,5vw,54px)] font-bold leading-none tracking-[-.035em] text-graphite">{{ data.products ?? '—' }}</p>
        <span class="absolute bottom-0 left-0 h-1 w-full bg-forest" aria-hidden="true"></span>
      </article>

      <article class="relative min-h-[170px] overflow-hidden border border-[#d9d8cf] bg-clean-label p-5 sm:p-6">
        <div class="flex items-start justify-between">
          <div><p class="mb-2 font-utility text-[9px] font-semibold uppercase tracking-[.14em] text-steel">Categorías</p><p class="m-0 text-xs text-[#8a9086]">Grupos de productos</p></div>
          <span class="grid size-9 place-items-center border border-[#d9d8cf] font-utility text-sm text-[#788176]" aria-hidden="true">◫</span>
        </div>
        <p class="mb-0 mt-7 font-display text-[clamp(38px,5vw,54px)] font-bold leading-none tracking-[-.035em] text-graphite">{{ data.categories ?? '—' }}</p>
        <span class="absolute bottom-0 left-0 h-1 w-full bg-[#9ca49a]" aria-hidden="true"></span>
      </article>

      <article class="relative min-h-[170px] overflow-hidden bg-forest p-5 text-clean-label sm:p-6">
        <div class="flex items-start justify-between">
          <div><p class="mb-2 font-utility text-[9px] font-semibold uppercase tracking-[.14em] text-white/75">Bajo stock</p><p class="m-0 text-xs text-white/60">Productos reportados</p></div>
          <span class="grid size-9 place-items-center border border-white/25 font-utility text-sm text-safety-amber" aria-hidden="true">!</span>
        </div>
        <p class="mb-0 mt-7 font-display text-[clamp(38px,5vw,54px)] font-bold leading-none tracking-[-.035em] text-safety-amber">{{ data.low_stock?.length ?? '—' }}</p>
        <span class="absolute bottom-0 left-0 h-1 w-full bg-safety-amber" aria-hidden="true"></span>
      </article>
    </section>

    <section class="mt-7 border border-[#d9d8cf] bg-clean-label sm:mt-9" aria-labelledby="activity-title" :aria-busy="loading">
      <header class="flex flex-wrap items-center justify-between gap-3 border-b border-[#d9d8cf] px-5 py-4 sm:px-6 sm:py-5">
        <div>
          <p class="mb-1 font-utility text-[8px] font-semibold uppercase tracking-[.15em] text-steel">Operations log</p>
          <h3 id="activity-title" class="m-0 font-display text-[22px] font-bold leading-tight text-graphite">Últimos movimientos</h3>
        </div>
        <span class="inline-flex items-center gap-2 border border-[#deddd4] px-2.5 py-1.5 font-utility text-[8px] font-semibold uppercase tracking-[.1em] text-[#687266]"><span class="size-1.5 rounded-full bg-safety-amber" aria-hidden="true"></span> {{ data.last_movements?.length || 0 }} recientes</span>
      </header>

      <ul v-if="!loading && data.last_movements?.length" class="m-0 list-none divide-y divide-[#e5e3da] p-0">
        <li v-for="movement in data.last_movements" :key="movement.id" class="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 px-5 py-4 transition-colors hover:bg-[#f7f6f0] sm:grid-cols-[minmax(140px,.48fr)_minmax(90px,.25fr)_1fr] sm:gap-6 sm:px-6">
          <span class="inline-flex w-fit items-center gap-2 border px-2.5 py-1.5 font-utility text-[9px] font-semibold uppercase tracking-[.08em]" :class="String(movement.type).toUpperCase() === 'ENTRADA' ? 'border-[#cbd8c9] bg-[#edf2eb] text-forest' : 'border-[#e7d5b4] bg-[#f7f0e2] text-[#8a6427]'">
            <span class="size-1.5" :class="String(movement.type).toUpperCase() === 'ENTRADA' ? 'bg-forest' : 'bg-safety-amber'" aria-hidden="true"></span>{{ movement.type }}
          </span>
          <span class="justify-self-end font-utility text-xs font-semibold tabular-nums text-graphite sm:justify-self-start">{{ movement.quantity }} <span class="font-normal text-[#8a9086]">uds.</span></span>
          <span class="col-span-2 text-sm text-[#6f786e] sm:col-span-1">{{ movement.reason }}</span>
        </li>
      </ul>
      <div v-else-if="loading" class="grid gap-px bg-[#e5e3da]" aria-hidden="true">
        <div v-for="row in 3" :key="row" class="flex h-[68px] items-center justify-between bg-clean-label px-5 sm:px-6"><span class="h-6 w-20 animate-pulse bg-[#eeede6] motion-reduce:animate-none"></span><span class="h-3 w-1/3 animate-pulse bg-[#eeede6] motion-reduce:animate-none"></span></div>
      </div>
      <p v-else-if="!error" class="m-0 px-5 py-12 text-center text-sm text-steel">Todavía no hay movimientos registrados.</p>
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
