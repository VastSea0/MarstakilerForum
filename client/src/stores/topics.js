import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApiPrivate } from '@/combosables/useApi'

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

export const useTopicsStore = defineStore('topic', () => {
  const topics = ref([])
  const topic = ref({})
  const api = useApiPrivate()

  const getAllTopics = async () => {
    try {
      const { data } = await api.get('/topics')
      topics.value = data.data || data // API yanıtınızın yapısına göre ayarlayın
      return topics.value
    } catch (error) {
      handleError(error, 'Failed to fetch topics')
    }
  }

  const getTopic = async (id) => {
    try {
      const { data } = await api.get(`/topics/${id}`)
      topic.value = data.data || data
      return topic.value
    } catch (error) {
      handleError(error, 'Failed to fetch topic')
    }
  }

  const deleteTopic = async (id) => {
    try {
      const { data } = await api.delete(`/topics/${id}`)
      topics.value = topics.value.filter((t) => t.id !== id)
      return data
    } catch (error) {
      handleError(error, 'Failed to delete topic')
    }
  }

  const likeTopic = async (id) => {
    try {
      const { data } = await api.post(`/topics/like/${id}`)
      await getTopic(id) // Topic'i yeniden getir
      return data
    } catch (error) {
      handleError(error, 'Failed to like topic')
    }
  }

  const dislikeTopic = async (id) => {
    try {
      const { data } = await api.post(`/topics/dislike/${id}`)
      await getTopic(id) // Topic'i yeniden getir
      return data
    } catch (error) {
      handleError(error, 'Failed to dislike topic')
    }
  }

  return {
    topics,
    topic,
    getAllTopics,
    getTopic,
    deleteTopic,
    likeTopic,
    dislikeTopic
  }
})
