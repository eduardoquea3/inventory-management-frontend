<template>
  <main class="space-y-6 pb-10">
    <header class="flex flex-wrap items-end justify-between gap-4 border-b border-[#d8d5ca] pb-5">
      <div>
        <p class="mb-2 font-utility text-[9px] font-semibold uppercase tracking-[.15em] text-steel">Inventory <span class="px-1 text-safety-amber">/</span> Stock control</p>
        <h2 class="m-0 font-display text-[clamp(30px,4vw,42px)] font-semibold leading-none tracking-[-.03em] text-graphite">Movimientos de stock</h2>
        <p class="mb-0 mt-3 text-sm text-[#6f786e]">Registra entradas y salidas para este producto.</p>
      </div>
      <router-link to="/products" class="inline-flex h-10 items-center gap-2 border border-[#c9cdc2] bg-clean-label px-3 text-xs font-semibold text-graphite no-underline transition hover:border-forest hover:text-forest"><span aria-hidden="true">←</span> Volver a productos</router-link>
    </header>

    <p v-if="error" class="border-l-2 border-red-700 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{{ error }}</p>
    <p v-if="success" class="border-l-2 border-forest bg-[#edf2eb] px-4 py-3 text-sm text-forest" role="status">{{ success }}</p>

    <div class="grid items-start gap-5 xl:grid-cols-[minmax(280px,.72fr)_minmax(0,1.5fr)]">
      <section class="overflow-hidden border border-[#d9d8cf] bg-clean-label">
        <div class="flex items-center gap-3 border-b border-[#d9d8cf] px-5 py-4">
          <span class="grid size-9 place-items-center border border-[#d9d8cf] font-utility text-sm text-forest" aria-hidden="true">↕</span>
          <div><p class="mb-0.5 font-utility text-[8px] font-semibold uppercase tracking-[.13em] text-steel">Stock control</p><h3 class="m-0 font-display text-lg font-bold text-graphite">Registrar movimiento</h3></div>
        </div>
        <form class="grid gap-5 p-5" @submit.prevent="save">
          <label for="movement-type" class="grid gap-2 font-utility text-[9px] font-semibold uppercase tracking-[.1em] text-[#596357]">Tipo de movimiento
            <select id="movement-type" v-model="form.type" :disabled="saving" class="h-11 w-full border border-[#c9cdc2] bg-white px-3 font-body text-sm font-normal normal-case tracking-normal text-graphite outline-none focus:border-forest focus:ring-2 focus:ring-forest/15 disabled:bg-[#f2f0e8]">
              <option value="entrada">Entrada</option><option value="salida">Salida</option>
            </select>
          </label>

          <label for="movement-quantity" class="grid gap-2 font-utility text-[9px] font-semibold uppercase tracking-[.1em] text-[#596357]">Cantidad
            <input id="movement-quantity" v-model="form.quantity" name="quantity" type="number" step="any" min="0" placeholder="Cantidad" required :disabled="saving" @input="clearMessages" class="h-11 w-full border border-[#c9cdc2] bg-white px-3 font-utility text-sm font-normal tracking-normal text-graphite outline-none placeholder:font-body placeholder:text-[#9ba197] focus:border-forest focus:ring-2 focus:ring-forest/15 disabled:bg-[#f2f0e8]" />
          </label>

          <label for="movement-reason" class="grid gap-2 font-utility text-[9px] font-semibold uppercase tracking-[.1em] text-[#596357]">Motivo
            <input id="movement-reason" v-model="form.reason" name="reason" placeholder="Motivo" :disabled="saving" @input="clearMessages" class="h-11 w-full border border-[#c9cdc2] bg-white px-3 font-body text-sm font-normal normal-case tracking-normal text-graphite outline-none placeholder:text-[#9ba197] focus:border-forest focus:ring-2 focus:ring-forest/15 disabled:bg-[#f2f0e8]" />
          </label>

          <button type="submit" :disabled="saving || loading" class="flex min-h-11 items-center justify-between bg-graphite px-4 text-sm font-semibold text-clean-label transition hover:bg-forest disabled:cursor-wait disabled:opacity-60"><span>{{ saving ? 'Registrando…' : 'Registrar movimiento' }}</span><span class="text-safety-amber" aria-hidden="true">→</span></button>
        </form>
        <p class="m-0 border-t border-[#e5e3da] bg-[#f7f6f0] px-5 py-3 font-utility text-[8px] uppercase leading-5 tracking-[.08em] text-steel"><span class="text-safety-amber">◆</span> La cantidad debe ser mayor que cero.</p>
      </section>

      <section class="overflow-hidden border border-[#d9d8cf] bg-clean-label" aria-labelledby="movement-history-title" :aria-busy="loading">
        <header class="flex flex-wrap items-center justify-between gap-3 border-b border-[#d9d8cf] px-5 py-4">
          <div><p class="mb-0.5 font-utility text-[8px] font-semibold uppercase tracking-[.13em] text-steel">Product ledger</p><h3 id="movement-history-title" class="m-0 font-display text-lg font-bold text-graphite">Historial de movimientos</h3></div>
          <span class="border border-[#deddd4] px-2.5 py-1.5 font-utility text-[8px] font-semibold uppercase tracking-[.1em] text-[#687266]">{{ movements.length }} registros</span>
        </header>
        <p v-if="loading" class="flex items-center gap-3 px-5 py-8 text-sm text-steel" role="status"><span class="size-2 animate-pulse rounded-full bg-safety-amber motion-reduce:animate-none"></span> Cargando movimientos…</p>
        <p v-else-if="!error && movements.length === 0" class="m-0 px-5 py-12 text-center text-sm text-steel">Todavía no hay movimientos de stock.</p>
        <div v-else-if="movements.length > 0" class="overflow-x-auto">
          <table class="w-full min-w-[540px] border-collapse text-left">
            <thead class="bg-[#f2f0e8]"><tr class="font-utility text-[8px] font-semibold uppercase tracking-[.12em] text-[#737c71]"><th class="px-4 py-3 font-semibold">ID</th><th class="px-4 py-3 font-semibold">Tipo</th><th class="px-4 py-3 text-right font-semibold">Cantidad</th><th class="px-4 py-3 font-semibold">Motivo</th></tr></thead>
            <tbody class="divide-y divide-[#e5e3da]">
              <tr v-for="movement in movements" :key="movement.id" class="text-sm transition-colors hover:bg-[#f8f7f2]">
                <td class="px-4 py-3.5 font-utility text-[10px] tabular-nums text-[#858d82]">{{ movement.id }}</td>
                <td class="px-4 py-3.5"><span class="inline-flex items-center gap-2 border px-2 py-1 font-utility text-[8px] font-semibold uppercase tracking-[.08em]" :class="String(movement.type).toLowerCase() === 'entrada' ? 'border-[#cbd8c9] bg-[#edf2eb] text-forest' : 'border-[#e7d5b4] bg-[#f7f0e2] text-[#8a6427]'"><span class="size-1.5" :class="String(movement.type).toLowerCase() === 'entrada' ? 'bg-forest' : 'bg-safety-amber'" aria-hidden="true"></span>{{ movement.type }}</span></td>
                <td class="px-4 py-3.5 text-right font-utility text-xs font-semibold tabular-nums text-graphite">{{ movement.quantity }}</td>
                <td class="px-4 py-3.5 text-sm text-[#6f786e]">{{ movement.reason }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </main>
</template>

<script>
import api from '../api'

const emptyForm = () => ({ type: 'entrada', quantity: '', reason: '' })

export default {
  data() {
    return {
      movements: [],
      form: emptyForm(),
      loading: false,
      saving: false,
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
    async load() {
      this.loading = true
      this.error = ''
      try {
        const response = await api.get('/products/' + this.$route.params.id + '/stock-movements')
        this.movements = response.data
      } catch (error) {
        this.error = error.userMessage
      } finally {
        this.loading = false
      }
    },
    async save() {
      this.clearMessages()
      const quantity = Number(this.form.quantity)
      if (!this.form.quantity || !Number.isFinite(quantity) || quantity <= 0) {
        this.error = 'Ingresá una cantidad numérica mayor que cero.'
        return
      }

      this.saving = true
      try {
        await api.post('/products/' + this.$route.params.id + '/stock-movements', this.form)
        this.success = 'Movimiento registrado.'
        this.form = emptyForm()
        await this.load()
      } catch (error) {
        this.error = error.response?.data?.message || error.userMessage
      } finally {
        this.saving = false
      }
    }
  }
}
</script>
