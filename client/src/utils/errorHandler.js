import { useErrorStore } from '@/stores/error'

function handleError(error, defaultMessage) {
  const errorStore = useErrorStore()

  if (error.response) {
    console.log(error.response)
    console.log(error.response.data.message)
    errorStore.setError(error.response.data.message || defaultMessage)
  } else if (error.request) {
    console.log(error.request)
    errorStore.setError('Sunucudan bir yanıt gelmedi')
  } else {
    console.log(defaultMessage)
    errorStore.setError(error || defaultMessage)
  }
  console.log('Error:', error)
}

export default handleError
