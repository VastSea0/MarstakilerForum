<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { toRaw } from 'vue'

const authStore = useAuthStore()
import { onMounted, watch } from 'vue'

// Debug: authStore'in doğru şekilde yüklendiğinden emin olun
console.log('authStore:', authStore)

watch(
  () => authStore.authReady,
  (newVal) => {
    console.log('authReady changed:', newVal)
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
  console.log('Mounted: authStore.authReady:', authStore.authReady)
  console.log('Mounted: authStore.user:', toRaw(authStore.user))
})
</script>

<template>
  <header>
    <div>
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <RouterLink class="navbar-brand" to="/">
            <i class="fas fa-home"></i> Marstakiler Forum</RouterLink
          >
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <RouterLink class="nav-link" to="/about"
                  ><i class="fa-solid fa-user-group"></i> Hakkımızda</RouterLink
                >
              </li>
              <template v-if="authStore.authReady">
                <li class="nav-item dropdown">
                  <RouterLink
                    v-if="authStore.user && authStore.user.id"
                    class="dropdown-item"
                    :to="{ name: 'profile', params: { id: authStore.user.id } }"
                    >Profil</RouterLink
                  >
                </li>
              </template>

              <template v-else>
                <li class="nav-item dropdown">
                  <button
                    class="nav-link dropdown-toggle"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i class="fa-solid fa-user"></i>
                  </button>
                  <ul class="dropdown-menu">
                    <li>
                      <RouterLink class="dropdown-item" to="/login">
                        <i class="fa-solid fa-right-to-bracket"></i> Giriş yap</RouterLink
                      >
                    </li>
                    <li><hr class="dropdown-divider" /></li>
                    <li>
                      <RouterLink class="dropdown-item" to="/register">
                        <i class="fa-solid fa-right-to-bracket"></i> Kayıt ol</RouterLink
                      >
                    </li>
                  </ul>
                </li>
              </template>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </header>
  <div class="container" style="padding: 30px">
    <RouterView />
  </div>
  <footer class="footer">
    <p>Her Hakkı Saklıdır 2024 | Marstakiler</p>
  </footer>
</template>
<style>
.footer {
  background-color: #333;
  color: #fff;
  padding: 20px;
  text-align: center;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}
</style>
