<template>
  <router-view v-if="$route && $route.path === '/login'" />
  <div v-else class="app-shell min-h-screen bg-warehouse-paper font-body text-graphite">
    <aside class="sidebar fixed inset-y-0 left-0 z-40 flex w-[252px] -translate-x-full flex-col bg-graphite px-[18px] pb-5 pt-[27px] text-clean-label transition-transform md:translate-x-0" :class="{ 'sidebar--open': menuOpen, 'translate-x-0': menuOpen }">
      <a class="brand-mark mb-[35px] flex items-center gap-3 px-[7px] no-underline" href="/dashboard" aria-label="Inventory desk home">
        <span class="brand-mark__icon grid size-[38px] place-items-center border border-[#687168] font-display text-[21px] font-bold text-safety-amber" aria-hidden="true">W</span>
        <span class="brand-mark__text font-display text-[13px] font-bold leading-[1.1] tracking-[.13em]">WAREHOUSE<span class="mt-[5px] block font-utility text-[9px] font-semibold tracking-[.17em] text-[#9ca39c]">OPERATIONS</span></span>
      </a>

      <div class="sidebar__section-label mb-[11px] px-[10px] font-utility text-[10px] font-semibold tracking-[.12em] text-[#8e988f]">WORKSPACE</div>
      <nav class="nav grid gap-[5px]" aria-label="Primary inventory navigation">
        <router-link to="/dashboard" class="group flex min-h-11 items-center gap-3 border-l-2 border-transparent px-[11px] text-[13px] text-[#b9c0b8] no-underline transition hover:border-safety-amber hover:bg-[#2c362d] hover:text-clean-label" active-class="!border-safety-amber !bg-[#2c362d] !text-clean-label" @click="menuOpen = false"><span class="nav__glyph w-[18px] text-center text-base text-steel group-hover:text-safety-amber" aria-hidden="true">▦</span>Overview</router-link>
        <router-link to="/products" class="group flex min-h-11 items-center gap-3 border-l-2 border-transparent px-[11px] text-[13px] text-[#b9c0b8] no-underline transition hover:border-safety-amber hover:bg-[#2c362d] hover:text-clean-label" active-class="!border-safety-amber !bg-[#2c362d] !text-clean-label" @click="menuOpen = false"><span class="nav__glyph w-[18px] text-center text-base text-steel group-hover:text-safety-amber" aria-hidden="true">▤</span>Products</router-link>
        <router-link to="/categories" class="group flex min-h-11 items-center gap-3 border-l-2 border-transparent px-[11px] text-[13px] text-[#b9c0b8] no-underline transition hover:border-safety-amber hover:bg-[#2c362d] hover:text-clean-label" active-class="!border-safety-amber !bg-[#2c362d] !text-clean-label" @click="menuOpen = false"><span class="nav__glyph w-[18px] text-center text-base text-steel group-hover:text-safety-amber" aria-hidden="true">◫</span>Categories</router-link>
      </nav>

      <div class="sidebar__footer mt-auto flex items-center gap-[10px] border-t border-[#394239] px-[9px] pt-[14px] font-utility text-[9px] leading-[1.7] tracking-[.12em] text-[#9ca39c]">
        <span class="status-light size-[7px] rounded-full bg-[#83a078] shadow-[0_0_0_3px_#43513f]" aria-hidden="true"></span>
        <span>STOCK SYSTEM<br /><strong class="font-body text-[11px] font-medium tracking-normal text-[#e3e5de]">Ready for work</strong></span>
      </div>
    </aside>

    <div v-if="menuOpen" class="mobile-scrim fixed inset-0 z-30 bg-[#181f19]/50 md:hidden" @click="menuOpen = false"></div>
    <div class="workspace min-h-screen md:ml-[252px]">
      <header class="topbar sticky top-0 z-20 flex h-[66px] items-center justify-between border-b border-[#dcd9ce] bg-clean-label px-[clamp(16px,3vw,38px)]">
        <div class="topbar__breadcrumb flex items-center gap-[11px] text-xs"><span class="font-utility text-[10px] tracking-[.1em] text-steel">WORKSPACE</span><span class="breadcrumb-divider text-[#c3c5bc]">/</span><strong class="font-semibold">Inventory desk</strong></div>
        <div class="flex items-center gap-3">
          <button class="logout-button flex items-center gap-2 border-0 bg-transparent px-[10px] py-2 text-xs text-[#5d665e] transition hover:text-graphite" type="button" @click="logout"><span class="text-base text-safety-amber" aria-hidden="true">↗</span> Sign out</button>
          <button class="menu-toggle grid size-[34px] content-center gap-1 border border-[#dcd9ce] bg-transparent p-[7px] md:hidden" type="button" :aria-expanded="menuOpen" aria-label="Toggle navigation" @click="menuOpen = !menuOpen">
            <span class="h-px bg-graphite"></span><span class="h-px bg-graphite"></span><span class="h-px bg-graphite"></span>
          </button>
        </div>
      </header>
      <main class="workspace__content mx-auto min-h-[calc(100vh-115px)] max-w-[1440px] px-[clamp(17px,3vw,38px)] pb-[54px] pt-9">
        <div class="page-heading mb-[27px] flex items-end justify-between gap-5">
          <div><p class="eyebrow mb-[9px] font-utility text-[9px] font-semibold text-steel">WAREHOUSE OPERATIONS <span class="px-[5px] text-safety-amber">•</span> INVENTORY</p><h1 class="m-0 font-display text-[clamp(28px,3vw,38px)] font-bold leading-none tracking-[-.025em] text-graphite">Inventory desk</h1></div>
          <div class="page-heading__rule mb-[5px] h-px w-[38%] bg-[#d8d5ca]" aria-hidden="true"></div>
        </div>
        <router-view />
      </main>
      <footer class="workspace__footer flex justify-between border-t border-[#dcd9ce] px-[clamp(17px,3vw,38px)] py-[17px] font-utility text-[9px] font-semibold tracking-[.12em] text-steel max-[760px]:text-[8px]"><span>INVENTORY MANAGEMENT</span><span>BUILT FOR THE FLOOR <b class="pl-[5px] text-[8px] text-safety-amber">◆</b></span></footer>
    </div>
  </div>
</template>

<script>
import api from './api'
import { useAuthStore } from './stores/auth'

export default {
  data() {
    return { menuOpen: false }
  },
  methods: {
    async logout() {
      try {
        await api.post('/logout')
      } catch {
        // Clear the local session even if the API is unavailable.
      }
      useAuthStore().clearToken()
      this.$router.push('/login')
    }
  }
}
</script>
