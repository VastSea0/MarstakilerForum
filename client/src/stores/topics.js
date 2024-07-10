import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApiPrivate } from '@/combosables/useApi'
import handleError from '@/utils/errorHandler'
import { useErrorStore } from './error'

export const useTopicsStore = defineStore('topic', () => {
  const errorStore = useErrorStore()
  const topics = ref([])
  const topic = ref({})
  const topicsByUser = ref([])
  const api = useApiPrivate()

  const getAllTopics = async () => {
    errorStore.clearError()
    try {
      const response = await api.get('/topics')
      if (response.status === 200) {
        console.log(response.data.data.topics)
        topics.value = response.data.data.topics
        console.log(response.data.data.topics)
        return { data: topics.value }
      } else if (response.status === 204) {
        topic.value = []
        handleError('Listelenecek bir gönderi bulunamadı', 'Recep')
      }
    } catch (error) {
      console.log(error)
      handleError(error, 'Gönderiler listelenemedi')
    }
  }

  const getTopicsByUser = async (userId) => {
    errorStore.clearError()
    try {
      await getAllTopics()
      topicsByUser.value = topics.value.filter((t) => t.author === userId)
      return topicsByUser.value
    } catch (error) {
      handleError(error, 'Kullanıcı gönderileri alınamadı')
    }
  }

  const getTopic = async (id) => {
    errorStore.clearError()
    try {
      const { data } = await api.get(`/topics/${id}`)
      console.log(data.data.topic)
      topic.value = data.data.topic
      return topic.value
    } catch (error) {
      handleError(error, 'Gönderi bilgileri alınamadı')
    }
  }

  const addTopic = async (newTopic) => {
    errorStore.clearError()
    try {
      console.log('new Topics: ', newTopic)
      const response = await api.post('/topics', JSON.stringify(newTopic))
      if (response.status === 200) {
        console.log('saved new topic: ', response.data.data.topic)
        topics.value.unshift(response.data.data.topic)
        return response.data.data.topic
      }
    } catch (error) {
      handleError(error, 'Gönderi eklenemedi')
    }
  }

  const deleteTopic = async (id) => {
    errorStore.clearError()
    try {
      const response = await api.delete(`/topics/${id}`)
      if (response.status === 200) {
        topics.value = topics.value.filter((t) => t._id !== id)
        return { data: response.data.message }
      }
    } catch (error) {
      handleError(error, 'Gönderi silinemedi')
    }
  }

  const actionTopic = async (action, id, userId) => {
    errorStore.clearError()
    try {
      const response = await api.post(`/topics/${action}/${id}`)
      if (response.status === 200) {
        const updatedTopic = response.data.data.topic
        updateTopicInStore(id, updatedTopic, userId)
        return { data: updatedTopic }
      }
    } catch (error) {
      handleError(error, 'İşlem başarısız')
    }
  }

  const updateTopicInStore = (id, updatedTopic, userId) => {
    const updateTopic = (t) => {
      if (t._id !== id) return t
      return {
        ...t,
        likes: updatedTopic.likes,
        dislikes: updatedTopic.dislikes,
        likeCount: updatedTopic.likes.length,
        dislikeCount: updatedTopic.dislikes.length,
        userLiked: updatedTopic.likes.includes(userId),
        userDisliked: updatedTopic.dislikes.includes(userId)
      }
    }

    topics.value = topics.value.map(updateTopic)
    if (topic.value._id === id) topic.value = updateTopic(topic.value)
  }
  const actionComment = async (action, commentId, userId) => {
    errorStore.clearError()
    try {
      const response = await api.post(`/comments/${action}/${commentId}`)
      if (response.status === 200) {
        updateCommentInStore(commentId, response.data.data.comment, userId)
        return response.data.data
      }
    } catch (error) {
      handleError(error, 'İşlem başarısız')
    }
  }

  const updateCommentInStore = (commentId, updatedComment, userId) => {
    if (!topic.value.comments) return

    topic.value.comments = topic.value.comments.map((comment) => {
      if (comment._id !== commentId) return comment
      return {
        ...comment,
        likes: updatedComment.likes,
        dislikes: updatedComment.dislikes,
        likeCount: updatedComment.likes.length,
        dislikeCount: updatedComment.dislikes.length,
        userLiked: updatedComment.likes.includes(userId),
        userDisliked: updatedComment.dislikes.includes(userId)
      }
    })
  }

  const addComment = async (topicId, content) => {
    errorStore.clearError()
    try {
      const { data } = await api.post(`/comments/${topicId}`, { content: String(content) })
      console.log('data.data', data.data)
      console.log('data.data.comment', data.data.comment)
      if (data.status && data.data.comment && topic.value._id === topicId) {
        topic.value = {
          ...topic.value,
          comments: [...(topic.value.comments || []), data.data.comment],
          commentCount: (topic.value.commentCount || 0) + 1
        }
      }
      return data.data.comment
    } catch (error) {
      handleError(error, 'Yorum eklenemedi')
    }
  }
  return {
    topics,
    topicsByUser,
    topic,
    getAllTopics,
    getTopicsByUser,
    getTopic,
    addTopic,
    deleteTopic,
    actionTopic,
    actionComment,
    addComment
  }
})
