<script setup>
import { useAuthStore } from '@/stores/auth'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const authStore = useAuthStore()

const loginData = reactive({
  username: '',
  password: ''
})

const errorMessage = ref('')

async function submit() {
  try {
    await authStore.login(loginData)
    router.push('/')
  } catch (err) {
    errorMessage.value = err.response?.data?.message || err.message || 'Login failed'
    console.error('Login error:', err)
  }
}
</script>

<template>
  <form @submit.prevent="submit">
    <div>
      <label for="username">Username:</label>
      <input v-model="loginData.username" type="text" id="username" required />
    </div>
    <div>
      <label for="password">Password:</label>
      <input v-model="loginData.password" type="password" id="password" required />
    </div>
    <button type="submit">Login</button>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </form>
</template>
