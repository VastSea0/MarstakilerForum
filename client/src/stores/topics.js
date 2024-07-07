import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApiPrivate } from '@/combosables/useApi'

const handleError = (error, defaultMessage) => {
  console.error(defaultMessage, error)
  throw error.response?.data?.message || error.message || defaultMessage
}

export const useTopicsStore = defineStore('topic', () => {
  const topics = ref([])
  const topic = ref({})
  const topicsByUser = ref([])
  const api = useApiPrivate()

  const fetchTopics = async (url) => {
    try {
      const { data } = await api.get(url)
      return data.data || data
    } catch (error) {
      handleError(error, `Failed to fetch from ${url}`)
    }
  }

  const getAllTopics = async () => {
    topics.value = await fetchTopics('/topics')
    return topics.value
  }

  const getTopicsByUser = async (userId) => {
    await getAllTopics()
    topicsByUser.value = topics.value.filter((t) => t.author === userId)
    return topicsByUser.value
  }

  const getTopic = async (id) => {
    topic.value = await fetchTopics(`/topics/${id}`)
    return topic.value
  }

  const deleteTopic = async (id) => {
    try {
      await api.delete(`/topics/${id}`)
      topics.value = topics.value.filter((t) => t._id !== id)
    } catch (error) {
      handleError(error, 'Failed to delete topic')
    }
  }

  const actionTopic = async (action, id) => {
    try {
      await api.post(`/topics/${action}/${id}`)
      updateTopicInStore(id, action)
    } catch (error) {
      handleError(error, `Failed to ${action} topic`)
    }
  }

  const updateTopicInStore = (id, action) => {
    const updateTopic = (t) => {
      if (t._id !== id) return t
      const newTopic = { ...t }
      const isLike = action === 'like'
      const countKey = isLike ? 'likeCount' : 'dislikeCount'
      const oppositeKey = isLike ? 'dislikeCount' : 'likeCount'

      if (newTopic[countKey] === 0) {
        newTopic[countKey] = 1
        if (newTopic[oppositeKey] > 0) newTopic[oppositeKey] -= 1
      } else {
        newTopic[countKey] = 0
      }
      return newTopic
    }

    topics.value = topics.value.map(updateTopic)
    if (topic.value._id === id) topic.value = updateTopic(topic.value)
  }

  const actionComment = async (action, commentId) => {
    try {
      await api.post(`/comments/${action}/${commentId}`)
      updateCommentInStore(commentId, action)
    } catch (error) {
      handleError(error, `Failed to ${action} comment`)
    }
  }

  const updateCommentInStore = (commentId, action) => {
    const updateComment = (c) => {
      if (c._id !== commentId) return c
      const newComment = { ...c }
      const isLike = action === 'like'
      const countKey = isLike ? 'likeCount' : 'dislikeCount'
      const oppositeKey = isLike ? 'dislikeCount' : 'likeCount'

      if (newComment[countKey] === 0) {
        newComment[countKey] = 1
        if (newComment[oppositeKey] > 0) newComment[oppositeKey] -= 1
      } else {
        newComment[countKey] = 0
      }
      return newComment
    }

    if (topic.value.comments) {
      topic.value.comments = topic.value.comments.map(updateComment)
    }
  }
  const addComment = async (topicId, content) => {
    try {
      const { data } = await api.post(`/comments/${topicId}`, { content: String(content) })
      if (data.success && data.comment && topic.value._id === topicId) {
        topic.value = {
          ...topic.value,
          comments: [...(topic.value.comments || []), data.comment],
          commentCount: (topic.value.commentCount || 0) + 1
        }
      }
      return data.comment
    } catch (error) {
      handleError(error, 'Failed to add comment')
    }
  }
  return {
    topics,
    topicsByUser,
    topic,
    getAllTopics,
    getTopicsByUser,
    getTopic,
    deleteTopic,
    actionTopic,
    actionComment,
    addComment
  }
})
