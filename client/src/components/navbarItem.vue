<script setup>
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { toRaw } from 'vue'

const authStore = useAuthStore()
import { onMounted, watch } from 'vue'

// Debug: authStore'in doğru şekilde yüklendiğinden emin olun
console.log('authStore:', authStore)

watch(
  () => authStore.isAuthenticated,
  (newVal) => {
    console.log('isAuthenticated changed:', newVal)
  },
  { immediate: true }
)

watch(
  () => authStore.user,
  (newVal) => {
    console.log('user changed:', newVal)
  },
  { immediate: true }
)

onMounted(() => {
  console.log('Mounted: authStore isAuthenticated:', authStore.isAuthenticated)
  console.log('Mounted: authStore.user:', toRaw(authStore.user))
})
</script>
<template>
  <div class="navbar bg-base-100">
    <div class="flex-1">
      <RouterLink class="btn btn-ghost text-xl" to="/">Marslılar</RouterLink>
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal px-1">
        <li><RouterLink to="/about">Hakkımızda</RouterLink></li>
        <template v-if="authStore.isAuthenticated">
          <li>
            <RouterLink
              v-if="authStore.user && authStore.user.id"
              class="dropdown-item"
              :to="{ name: 'profile', params: { id: authStore.user.id } }"
              >Profil</RouterLink
            >
          </li>
        </template>
        <template v-else>
          <li>
            <RouterLink to="/login">Giriş yap</RouterLink>
          </li>
          <li>
            <RouterLink to="/register">Kayıt ol</RouterLink>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>
