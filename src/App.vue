<template>
  <router-view v-if="$route && $route.path === '/login'" />
  <div v-else class="app-shell">
    <aside class="sidebar" :class="{ 'sidebar--open': menuOpen }">
      <a class="brand-mark" href="/dashboard" aria-label="Inventory desk home">
        <span class="brand-mark__icon" aria-hidden="true">W</span>
        <span class="brand-mark__text">WAREHOUSE<span>OPERATIONS</span></span>
      </a>

      <div class="sidebar__section-label">WORKSPACE</div>
      <nav class="nav" aria-label="Primary inventory navigation">
        <router-link to="/dashboard" @click="menuOpen = false"><span class="nav__glyph" aria-hidden="true">▦</span>Overview</router-link>
        <router-link to="/products" @click="menuOpen = false"><span class="nav__glyph" aria-hidden="true">▤</span>Products</router-link>
        <router-link to="/categories" @click="menuOpen = false"><span class="nav__glyph" aria-hidden="true">◫</span>Categories</router-link>
      </nav>

      <div class="sidebar__footer">
        <span class="status-light" aria-hidden="true"></span>
        <span>STOCK SYSTEM<br /><strong>Ready for work</strong></span>
      </div>
    </aside>

    <div v-if="menuOpen" class="mobile-scrim" @click="menuOpen = false"></div>
    <div class="workspace">
      <header class="topbar">
        <div class="topbar__breadcrumb"><span>WORKSPACE</span><span class="breadcrumb-divider">/</span><strong>Inventory desk</strong></div>
        <button class="logout-button" type="button" @click="logout"><span aria-hidden="true">↗</span> Sign out</button>
        <button class="menu-toggle" type="button" :aria-expanded="menuOpen" aria-label="Toggle navigation" @click="menuOpen = !menuOpen">
          <span></span><span></span><span></span>
        </button>
      </header>
      <main class="workspace__content">
        <div class="page-heading">
          <div><p class="eyebrow">WAREHOUSE OPERATIONS <span>•</span> INVENTORY</p><h1>Inventory desk</h1></div>
          <div class="page-heading__rule" aria-hidden="true"></div>
        </div>
        <router-view />
      </main>
      <footer class="workspace__footer"><span>INVENTORY MANAGEMENT</span><span>BUILT FOR THE FLOOR <b>◆</b></span></footer>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return { menuOpen: false }
  },
  methods: {
    logout() {
      localStorage.removeItem('token')
      this.$router.push('/login')
    }
  }
}
</script>
