import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/gonderiId',
      name: 'gonderiId',
      component: () => import('../views/PostView.vue')
    },
    {
      path: '/kullaniciId',
      name: 'kullaniciId',
      component: () => import('../views/ProfileView.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/SignInView.vue')
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/signupView.vue')
    }
  ]
})

router.beforeResolve(async (to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return next({ name: 'home' })
  } else {
    return next()
  }
})

export default router
