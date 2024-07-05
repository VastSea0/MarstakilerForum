<script setup>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTopicsStore } from '@/stores/topics'

const route = useRoute()
const topicStore = useTopicsStore()

const post = computed(() => topicStore.topic)
const errorMessage = computed(() => topicStore.error)

const fetchPost = async () => {
  const postId = route.params.id
  await topicStore.getTopic(postId)
}

onMounted(fetchPost)
</script>

<template>
  <div>
    <div v-if="errorMessage">{{ errorMessage }}</div>
    <div v-else-if="!post.title">Loading...</div>
    <div v-else>
      <h1>{{ post.title }}</h1>
      <p>{{ post.content }}</p>
      <p>Author: {{ post.author }}</p>
      <p>Likes: {{ post.likeCount }}</p>
      <p>Dislikes: {{ post.dislikeCount }}</p>
      <p>Comments: {{ post.commentCount }}</p>
    </div>
  </div>
</template>
