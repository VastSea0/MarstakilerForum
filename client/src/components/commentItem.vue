<script setup>
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTopicsStore } from '@/stores/topics'

const topicStore = useTopicsStore()
const authStore = useAuthStore()
const props = defineProps({
  comment: {
    type: Object,
    required: true
  }
})

const submit = async (action, id) => {
  try {
    await topicStore.actionComment(action, id, authStore.user.id)
  } catch (error) {
    console.error('Error fetching action:', error.message)
  }
}
</script>

<template>
  <div class="card card-compact bg-neutral text-primary-content mb-2">
    <div class="card-body">
      <h2 class="card-title"><span class="mr-1">💬</span>{{ props.comment.content }}</h2>
      <p class="font-medium text-base">
        <RouterLink :to="{ name: 'profile', params: { id: props.comment.author._id } }"
          >@{{ props.comment.author.username }}</RouterLink
        >
      </p>
      <div class="card-actions">
        <form @submit.prevent="submit('like', props.comment._id)">
          <button
            type="submit"
            :class="authStore.isAuthenticated ? '' : 'btn-disabled'"
            class="btn btn-outline btn-sm"
          >
            👍 {{ props.comment.likeCount }}
          </button>
        </form>
        <form @submit.prevent="submit('dislike', props.comment._id)">
          <button
            type="submit"
            :class="authStore.isAuthenticated ? '' : 'btn-disabled'"
            class="btn btn-outline btn-sm"
          >
            👎 {{ props.comment.dislikeCount }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
