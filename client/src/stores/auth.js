import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApi, useApiPrivate } from '@/combosables/useApi'

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
      accessToken.value = data.access_token
      return data
    } catch (error) {
      if (error.response) {
        // Sunucudan gelen hata yanıtı
        console.error('Server error:', error.response.data)
        throw new Error(error.response.data.message || 'Login failed')
      } else if (error.request) {
        // İstek yapıldı ama yanıt alınamadı
        console.error('No response:', error.request)
        throw new Error('No response from server')
      } else {
        // İstek yapılırken bir şeyler ters gitti
        console.error('Error:', error.message)
        throw error
      }
    }
  }

  const register = async (payload) => {
    try {
      const { data } = await useApi().post('/auth/register', payload)
      return data
    } catch (error) {
      if (error.response) {
        // Sunucudan gelen hata yanıtı
        console.error('Server error:', error.response.data)
        throw new Error(error.response.data.message || 'Login failed')
      } else if (error.request) {
        // İstek yapıldı ama yanıt alınamadı
        console.error('No response:', error.request)
        throw new Error('No response from server')
      } else {
        // İstek yapılırken bir şeyler ters gitti
        console.error('Error:', error.message)
        throw error
      }
    }
  }

  const getUser = async () => {
    try {
      const { data } = await useApiPrivate().get('/auth/user')
      user.value = data
      return data
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const logout = async () => {
    try {
      const { data } = await useApiPrivate().post('/auth/logout')
      accessToken.value = ''
      user.value = {}
      return data
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const refresh = async () => {
    try {
      const { data } = await useApi().post('/auth/token')
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
