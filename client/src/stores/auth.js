import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApi, useApiPrivate } from '../composables/useApi'

export const useAuthStore = defineStore('auth', () => {
  const user = ref({})
  const accessToken = ref('')
  const authReady = ref(false)

  const userDetail = computed(() => user.value)
  const isAuthenticated = computed(() => !!accessToken.value)

  const attempt = async () => {
    try {
      await refresh()
      await getUser()
    } catch (error) {
      return
    }
    return
  }

  const login = async (payload) => {
    try {
      const { data } = await useApi().post('/api/auth/login', payload)
      accessToken.value = data.access_token
      await getUser()
      return data
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const register = async (payload) => {
    try {
      const { data } = await useApi().post('/api/auth/register', payload)
      return data
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const getUser = async () => {
    try {
      const { data } = await useApiPrivate().get('/api/auth/user')
      user.value = data
      return data
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const logout = async () => {
    try {
      const { data } = await useApiPrivate().post('/api/auth/logout')
      accessToken.value = ''
      user.value = {}
      return data
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const refresh = async () => {
    try {
      const { data } = await useApi().post('/api/auth/refresh')
      accessToken.value = data.access_token
      return data
    } catch (error) {
      throw new Error(error.message)
    }
  }

  return {
    user,
    accessToken,
    authReady,
    userDetail,
    isAuthenticated,
    attempt,
    login,
    register,
    getUser,
    logout,
    refresh
  }
})
