import { axiosInstance, axiosPrivateInstance } from '../utils/axios'
import { useAuthStore } from '../stores/auth'
import { watchEffect } from 'vue'

export function useApiPrivate() {
  const authStore = useAuthStore()

  watchEffect(() => {
    axiosPrivateInstance.interceptors.request.use(
      async (config) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${authStore.accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    axiosPrivateInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config
        if (
          (error?.response?.status === 403 || error?.response?.status === 401) &&
          !prevRequest.sent
        ) {
          prevRequest.sent = true
          try {
            await authStore.refresh()
            prevRequest.headers['Authorization'] = `Bearer ${authStore.accessToken}`
            return await axiosPrivateInstance(prevRequest)
          } catch (err) {
            return Promise.reject(err)
          }
        }

        return Promise.reject(error)
      }
    )
  })

  return axiosPrivateInstance
}

export function useApi() {
  return axiosInstance
}
