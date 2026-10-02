<template>
  <main class="min-h-screen bg-[#f2f0e8] px-[6.2vw] text-[#202820] max-[700px]:px-[18px]">
    <header class="flex min-h-[92px] items-center justify-between border-b border-[#d8d8ce] max-[700px]:min-h-[74px]">
      <a class="inline-flex items-center gap-3 text-inherit no-underline" href="/login" aria-label="Warehouse operations sign in">
        <span class="grid size-[38px] place-items-center border border-[#778176] font-display text-[21px] font-bold text-[#354b3d]" aria-hidden="true">W</span>
        <span class="font-display text-xs font-bold uppercase leading-tight tracking-[.18em]">Warehouse<span class="mt-1 block font-utility text-[9px] font-semibold tracking-[.19em] text-[#879085]">Operations</span></span>
      </a>
      <span class="flex items-center gap-[9px] font-utility text-[9px] font-semibold uppercase tracking-[.12em] text-[#727c70] max-[700px]:text-[8px]"><i class="size-[7px] rounded-full bg-[#78946c] shadow-[0_0_0_3px_#dce2d5]" aria-hidden="true"></i> Stock system <b class="text-[#c2c4b9]">·</b> Online</span>
    </header>

    <section class="mx-auto my-7 grid min-h-[min(650px,calc(100vh-150px))] w-full max-w-[1040px] grid-cols-2 border border-[#d8d8ce] bg-[#fbfaf6] shadow-[0_18px_50px_rgb(32_40_32_/_8%)] max-[700px]:my-[18px] max-[700px]:mb-[30px] max-[700px]:min-h-0 max-[700px]:grid-cols-1" aria-labelledby="login-title">
      <aside class="relative flex min-h-[600px] flex-col justify-between overflow-hidden bg-[#354b3d] px-9 pb-[25px] pt-[30px] text-[#fbfaf6] [background-image:repeating-linear-gradient(135deg,transparent_0_23px,rgb(255_255_255_/_2.5%)_24px_25px)] max-[700px]:min-h-[260px] max-[700px]:px-[22px] max-[700px]:py-5">
        <div class="relative z-10 flex justify-between gap-3 font-utility text-[8px] font-semibold uppercase tracking-[.13em] text-[#c0c9bc]"><span>Warehouse operations</span><span class="text-[#e0a334]">01 — Access</span></div>
        <div class="absolute right-[-2%] top-[17%] h-1/2 w-[58%] opacity-60 max-[700px]:right-[-1%] max-[700px]:top-[13%] max-[700px]:h-[54%] max-[700px]:w-[45%]" aria-hidden="true">
          <span class="absolute right-[8%] top-0 font-utility text-[9px] tracking-[.14em] text-[#e0a334]">A / 04</span>
          <span class="absolute bottom-[10%] left-[14%] top-[12%] w-[5px] bg-[#83917d]"></span><span class="absolute bottom-[10%] right-[14%] top-[12%] w-[5px] bg-[#83917d]"></span>
          <span class="absolute left-[7%] right-[7%] top-[29%] flex h-1 justify-evenly bg-[#b4bcae]"><i class="relative -top-[26px] h-6 w-1/5 border border-white/35 bg-[#e0a334]/65"></i><i class="relative -top-[26px] h-6 w-1/5 border border-white/35 bg-[#e0a334]/65"></i><i class="relative -top-[26px] h-6 w-1/5 border border-white/35 bg-[#e0a334]/65"></i></span>
          <span class="absolute left-[7%] right-[7%] top-[55%] flex h-1 justify-evenly bg-[#b4bcae]"><i class="relative -top-[35px] h-[33px] w-1/5 border border-white/35 bg-white/10"></i><i class="relative -top-[35px] h-[33px] w-1/5 border border-white/35 bg-white/10"></i></span>
          <span class="absolute left-[7%] right-[7%] top-[81%] flex h-1 justify-evenly bg-[#b4bcae]"><i class="relative -top-[26px] h-6 w-1/5 border border-white/35 bg-[#e0a334]/65"></i><i class="relative -top-[26px] h-6 w-1/5 border border-white/35 bg-[#e0a334]/65"></i><i class="relative -top-[26px] h-6 w-1/5 border border-white/35 bg-[#e0a334]/65"></i></span>
          <span class="absolute bottom-[8%] left-0 right-0 h-px bg-[#8b9a85]"></span>
        </div>
        <div class="relative z-10 mb-auto mt-auto max-w-[345px] pb-[31px] pt-12 max-[700px]:pb-[25px] max-[700px]:pt-8">
          <p class="mb-[15px] font-utility text-[9px] font-semibold uppercase tracking-[.16em] text-[#bbc6b7]">Stock control · daily operations</p>
          <h1 class="m-0 font-display text-[clamp(39px,4vw,54px)] font-semibold leading-[.99] tracking-[-.04em]">Every item,<br />in its place.</h1>
          <p class="mt-[19px] max-w-[260px] text-[13px] leading-[1.7] text-[#d2d8ce] max-[700px]:mt-[11px] max-[700px]:text-xs">Keep the work moving. Your warehouse starts here.</p>
        </div>
        <div class="relative z-10 flex justify-between gap-3 border-t border-white/20 pt-[15px] font-utility text-[8px] font-semibold uppercase tracking-[.13em] text-[#b7c0b2] max-[700px]:text-[7px]"><span>Built for the floor</span><span>Inventory desk <b class="pl-1 text-[13px] text-[#e0a334]">↗</b></span></div>
      </aside>

      <div class="flex items-center justify-center px-[12%] py-[54px] max-[700px]:px-6 max-[700px]:pb-[30px] max-[700px]:pt-[42px]">
        <div class="w-full max-w-[350px]">
          <p class="mb-4 font-utility text-[9px] font-semibold uppercase tracking-[.16em] text-[#788176]">Team access <span class="px-[3px] text-[#d09a35]"> / </span> Sign in</p>
          <h2 id="login-title" class="m-0 font-display text-4xl font-semibold leading-[1.1] tracking-[-.035em] max-[700px]:text-[32px]">Welcome back.</h2>
          <p class="mt-[10px] text-[13px] text-[#747d73]">Use your work credentials to continue.</p>
          <p v-if="error" class="mt-[23px] border-l-[3px] border-[#ae4335] bg-[#f8eae5] px-[14px] py-3 text-[13px] text-[#842f27]" role="alert">{{ error }}</p>

          <form class="mt-9 grid gap-[22px] max-[700px]:mt-7 max-[700px]:gap-[18px]" @submit.prevent="login">
            <div class="grid gap-2">
              <label for="login-email" class="font-utility text-[9px] font-semibold uppercase tracking-[.12em] text-[#4c564c]">Email address</label>
              <input id="login-email" v-model="email" type="email" autocomplete="username" class="m-0 h-[49px] w-full rounded-none border border-[#c9cdc2] bg-white px-[13px] text-sm text-[#202820] outline-none transition focus:border-[#354b3d] focus:ring-[3px] focus:ring-[#354b3d]/[.13]" />
            </div>
            <div class="grid gap-2">
              <label for="login-password" class="font-utility text-[9px] font-semibold uppercase tracking-[.12em] text-[#4c564c]">Password</label>
              <input id="login-password" v-model="password" type="password" autocomplete="current-password" class="m-0 h-[49px] w-full rounded-none border border-[#c9cdc2] bg-white px-[13px] text-sm text-[#202820] outline-none transition focus:border-[#354b3d] focus:ring-[3px] focus:ring-[#354b3d]/[.13]" />
            </div>
            <button type="submit" class="group mt-1 flex min-h-[51px] items-center justify-between border-0 bg-[#202820] px-4 text-[13px] font-semibold text-white transition hover:bg-[#354b3d]"><span>Ingresar</span><span class="text-[19px] text-[#e0a334] transition-transform group-hover:translate-x-1" aria-hidden="true">→</span></button>
          </form>
          <div class="mt-[31px] flex items-center gap-[9px] border-t border-[#dedfd6] pt-[15px] font-utility text-[8px] font-semibold uppercase tracking-[.12em] text-[#7b8378] max-[700px]:mt-[25px]"><span class="text-[13px] text-[#9a7130]" aria-hidden="true">▣</span><span>Authorized personnel only</span></div>
        </div>
      </div>
    </section>
    <footer class="hidden pb-[18px] text-center font-utility text-[7px] font-semibold uppercase tracking-[.1em] text-[#838a7e] max-[700px]:block">WAREHOUSE OPERATIONS <span class="px-1 text-[#c4933c]">·</span> INVENTORY MANAGEMENT</footer>
  </main>
</template>

<script>
import api from '../api'
import { useAuthStore } from '../stores/auth'

export default {
  data() {
    return { email: 'admin@legacy.test', password: 'password', error: '' }
  },
  methods: {
    login() {
      // Legacy issue: no loading state and no strong frontend validation.
      api.post('/login', { email: this.email, password: this.password }).then(res => {
        useAuthStore().setToken(res.data.data.token)
        this.$router.push('/dashboard')
      }).catch(err => {
        this.error = err.userMessage
      })
    }
  }
}
</script>
