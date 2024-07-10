import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApi, useApiPrivate } from '@/combosables/useApi'
import handleError from '@/utils/errorHandler'
import { useErrorStore } from './error'

export const useAuthStore = defineStore('auth', () => {
  const errorStore = useErrorStore()
  const user = ref({})
  const accessToken = ref('')
  const authReady = ref(false)
  const userProfile = ref(null)

  const userDetail = computed(() => user.value)
  const isAuthenticated = computed(() => !!accessToken.value)

  const attempt = async () => {
    try {
      await refresh()
      await getUser()
    } catch (error) {
      // handleError(error, 'Bir Hata oluştu')
      return
    }
    return
  }

  const login = async (payload) => {
    errorStore.clearError()
    try {
      const { data } = await useApi().post('/auth/login', JSON.stringify(payload))
      console.log(data)
      accessToken.value = data.data.token
      user.value = data.data.user
      authReady.value = true
      return data
    } catch (error) {
      handleError(error, 'Giriş başarısız')
    }
  }

  const register = async (payload) => {
    errorStore.clearError()
    try {
      const response = await useApi().post('/auth/register', payload)
      if (response.status === 200) {
        console.log(response.data)
        return response.data.data
      }
    } catch (error) {
      handleError(error, 'Kayıt başarısız')
    }
  }

  const getUser = async () => {
    try {
      const { data } = await useApiPrivate().get('/auth/user')
      console.log(data)
      user.value = data.data.user
      return data
    } catch (error) {
      return error
    }
  }

  const getUserProfile = async (id) => {
    errorStore.clearError()
    try {
      const { data } = await useApiPrivate().get(`/auth/user/${id}`)
      console.log(data)
      userProfile.value = data.data.user
      return data
    } catch (error) {
      console.log(error)
      handleError(error, 'Profil bilgileri alınamadı')
    }
  }
  const setUserProfile = (profile) => {
    userProfile.value = profile
  }

  const logout = async () => {
    errorStore.clearError()
    try {
      const { data } = await useApiPrivate().delete('/auth/logout')
      accessToken.value = ''
      user.value = {}
      authReady.value = false
      console.log(data.message)
      return data
    } catch (error) {
      handleError(error, 'Çıkış başarısız')
    }
  }

  const refresh = async () => {
    try {
      const { data } = await useApi().get('/auth/token')
      console.log('Refresh token response:', data.data)
      user.value = data.data.user
      accessToken.value = data.data.token
      authReady.value = true
      console.log('New access token:', accessToken.value)
      return data.data.token
    } catch (error) {
      console.error('Refresh token error:', error)
      return error
    }
  }

  const updateProfile = async (userId, payload) => {
    errorStore.clearError()
    try {
      const { data } = await useApiPrivate().put(`/auth/user/${userId}`, payload)
      console.log('updated profile data: ', data)
      return data
    } catch (error) {
      handleError(error, 'Profil güncellenemedi')
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
    getUserProfile,
    userProfile,
    logout,
    refresh,
    updateProfile,
    setUserProfile
  }
})
