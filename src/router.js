import { createRouter, createWebHistory } from 'vue-router'
import Login from './views/Login.vue'
import Dashboard from './views/Dashboard.vue'
import Products from './views/Products.vue'
import ProductForm from './views/ProductForm.vue'
import Categories from './views/Categories.vue'
import StockMovements from './views/StockMovements.vue'
import { useAuthStore } from './stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/login', component: Login },
    { path: '/dashboard', component: Dashboard },
    { path: '/products', component: Products },
    { path: '/products/new', component: ProductForm },
    { path: '/products/:id/edit', component: ProductForm },
    { path: '/products/:id/stock', component: StockMovements },
    { path: '/categories', component: Categories },
  ]
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.path !== '/login' && !auth.isAuthenticated) return '/login'
})

export default router
