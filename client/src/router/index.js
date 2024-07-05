import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProfileView from '../views/ProfileView.vue'

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
      path: '/topic/:id',
      name: 'topic',
      component: () => import('../views/PostView.vue'),
      meta: { requiresAuth: true } // Örnek meta alanı, gereksinimlerinize göre güncelleyin
    },
    {
      path: '/profile/:id',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true } // Örnek meta alanı, gereksinimlerinize göre güncelleyin
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/SignInView.vue'),
      meta: { requiresGuest: true } // Örnek meta alanı, gereksinimlerinize göre güncelleyin
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/signupView.vue'),
      meta: { requiresGuest: true } // Örnek meta alanı, gereksinimlerinize göre güncelleyin
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
