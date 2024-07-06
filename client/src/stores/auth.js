import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApi, useApiPrivate } from '@/combosables/useApi'

const handleError = (error, defaultMessage) => {
  if (error.response) {
    console.error('Server error:', error.response.data)
    throw new Error(error.response.data.message || defaultMessage)
  } else if (error.request) {
    console.error('No response:', error.request)
    throw new Error('No response from server')
  } else {
    console.error('Error:', error.message)
    throw error
  }
}

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
      const { data } = await useApi().post('/auth/login', payload)
      console.log(data)
      accessToken.value = data.token
      authReady.value = true
      return data
    } catch (error) {
      handleError(error, 'Failed to login')
    }
  }

  const register = async (payload) => {
    try {
      const { data } = await useApi().post('/auth/register', payload)
      return data
    } catch (error) {
      handleError(error, 'Failed to register')
    }
  }

  const getUser = async () => {
    try {
      const { data } = await useApiPrivate().get('/auth/user')
      console.log(data)
      user.value = data.data
      return data
    } catch (error) {
      handleError(error, 'Failed to fetch user')
    }
  }

  const logout = async () => {
    try {
      const { data } = await useApiPrivate().post('/auth/logout')
      accessToken.value = ''
      user.value = {}
      authReady.value = false
      console.log('çıkış yapıldı')
      return data
    } catch (error) {
      handleError(error, 'Failed to logout')
    }
  }

  const refresh = async () => {
    try {
      const { data } = await useApi().get('/auth/token')
      console.log(data)
      user.value = data.data
      accessToken.value = data.token
      authReady.value = true
      return data
    } catch (error) {
      handleError(error, 'Failed to refresh token')
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
