// stores/errorStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useErrorStore = defineStore('error', () => {
  const error = ref(null)

  function setError(message) {
    error.value = message
  }

  function clearError() {
    error.value = null
  }

  return { error, setError, clearError }
})
