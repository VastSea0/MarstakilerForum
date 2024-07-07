<script setup>
import Post from '/src/components/postItem.vue'
import { ref, onMounted, computed } from 'vue'
import { useTopicsStore } from '@/stores/topics'

const topicStore = useTopicsStore()
const errorMessage = ref('')

// topics'i store'dan computed olarak alıyoruz
const posts = computed(() => topicStore.topics)

const fetchPosts = async () => {
  try {
    await topicStore.getAllTopics()
    console.log(posts)
    // getAllTopics fonksiyonu artık posts'u doğrudan store'da güncelleyecek
  } catch (err) {
    errorMessage.value = err.message || 'Failed to fetch posts'
    console.error('Error fetching posts:', err)
  }
}

onMounted(() => {
  fetchPosts()
})
</script>
<template>
  <template v-if="errorMessage">
    <div>
      {{ errorMessage }}
    </div>
  </template>
  <template v-else-if="posts.length === 0">
    <div>Loading...</div>
  </template>
  <div v-else>
    <h4 class="text-2xl font-semibold mb-3">Posts</h4>

    <template v-for="post in posts" :key="post._id">
      <Post :post="post"></Post>
    </template>
  </div>
</template>
