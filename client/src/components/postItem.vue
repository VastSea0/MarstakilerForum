<script setup>
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTopicsStore } from '@/stores/topics'

const topicStore = useTopicsStore()
const authStore = useAuthStore()
const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const submit = async (action, id) => {
  try {
    await topicStore.actionTopic(action, id, authStore.user.id)
  } catch (error) {
    console.error('Error fetching action:', error.message)
  }
}
</script>

<template>
  <div class="card card-compact bg-neutral text-primary-content mb-2">
    <div class="card-body">
      <h2 class="card-title">
        <RouterLink :to="{ name: 'topic', params: { id: props.post._id } }"
          ><span class="mr-1">📌</span>{{ props.post.title }}</RouterLink
        >
      </h2>
      <p class="font-medium text-base">
        <RouterLink :to="{ name: 'profile', params: { id: props.post.author._id } }"
          >@{{ props.post.author.username }}</RouterLink
        >
      </p>
      <div class="card-actions">
        <form @submit.prevent="submit('like', props.post._id)">
          <button
            type="submit"
            :class="authStore.isAuthenticated ? '' : 'btn-disabled'"
            class="btn btn-outline btn-sm"
          >
            👍 {{ props.post.likeCount }}
          </button>
        </form>
        <form @submit.prevent="submit('dislike', props.post._id)">
          <button
            type="submit"
            :class="authStore.isAuthenticated ? '' : 'btn-disabled'"
            class="btn btn-outline btn-sm"
          >
            👎 {{ props.post.dislikeCount }}
          </button>
        </form>

        <button class="btn btn-outline btn-disabled btn-sm">
          💬 {{ props.post.commentCount }}
        </button>
      </div>
    </div>
  </div>
</template>
