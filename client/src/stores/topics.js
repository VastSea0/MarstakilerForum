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
      console.log('ALL TOPİCS: ', data)
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

  const actionTopic = async (action, id) => {
    try {
      const { data } = await api.post(`/topics/${action}/${id}`)

      // Sadece ilgili alanları güncelle
      const updatedFields = {
        likeCount: data.likeCount,
        dislikeCount: data.dislikeCount
      }

      // topics dizisini ve topic nesnesini güncelle
      updateTopicInStore(id, updatedFields)

      return data
    } catch (error) {
      handleError(error, 'Failed to perform action on topic')
    }
  }

  const updateTopicInStore = (id, updatedFields) => {
    // topics dizisini güncelle
    const indexTopic = topics.value.findIndex((t) => t._id === id)
    if (indexTopic !== -1) {
      topics.value[indexTopic] = { ...topics.value[indexTopic], ...updatedFields }
    }

    // Eğer güncel topic bu ise, onu da güncelle
    if (topic.value._id === id) {
      topic.value = { ...topic.value, ...updatedFields }
    }
  }
  return {
    topics,
    topic,
    getAllTopics,
    getTopic,
    deleteTopic,
    actionTopic
  }
})
