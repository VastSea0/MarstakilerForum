// Oluşturduğumuz Axios instance'larını içe aktarıyoruz.
import { axiosInstance, axiosPrivateInstance } from '../utils/axios'
// Kimlik doğrulama işlemleri için auth store'u içe aktarıyoruz.
import { useAuthStore } from '../stores/auth'

// Özel API kullanımı için bir fonksiyon tanımlıyoruz.
export function useApiPrivate() {
  // Auth store'u kullanıyoruz.
  const authStore = useAuthStore()

  // İstek interceptor'ını tanımlıyoruz.
  axiosPrivateInstance.interceptors.request.use(
    async (config) => {
      if (!config.headers['Authorization']) {
        const token = authStore.accessToken
        console.log('Token: ', token)
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`
        }
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  axiosPrivateInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config
      if (error.response.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true
        try {
          console.log('Attempting to refresh token')
          await authStore.refresh()
          const newToken = authStore.accessToken
          console.log('New token after refresh:', newToken)
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`
          return axiosPrivateInstance(originalRequest)
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError)
          return Promise.reject(refreshError)
        }
      }
      return Promise.reject(error)
    }
  )

  // Özel Axios instance'ını döndürüyoruz.
  return axiosPrivateInstance
}

// Genel API kullanımı için bir fonksiyon tanımlıyoruz.
export function useApi() {
  // Genel Axios instance'ını döndürüyoruz.
  return axiosInstance
}
