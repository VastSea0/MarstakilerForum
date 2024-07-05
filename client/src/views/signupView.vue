<script setup>
import { useAuthStore } from '@/stores/auth'
import { reactive, ref } from 'vue'

const authStore = useAuthStore()

const registerData = reactive({
  firstName: '',
  lastName: '',
  username: '',
  password: ''
})

const errorMessage = ref('')

async function submit() {
  try {
    await authStore.register(registerData)
    // router.replace({ name: 'login' })
  } catch (err) {
    errorMessage.value = err.response?.data?.message || err.message || 'Login failed'
    console.error('Login error:', err)
  }
}
</script>
<template>
  <div>
    <form @submit.prevent="submit">
      <div>
        <label for="firstName">First Name:</label>
        <input v-model="registerData.firstName" type="text" id="firstName" required />
      </div>
      <div>
        <label for="lastName">Last Name:</label>
        <input v-model="registerData.lastName" type="text" id="lastName" required />
      </div>
      <div>
        <label for="username">Username:</label>
        <input v-model="registerData.username" type="text" id="username" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input v-model="registerData.password" type="password" id="password" required />
      </div>
      <button type="submit">Register</button>
      <p v-if="errorMessage">{{ errorMessage }}</p>
    </form>
  </div>
</template>
