<script setup>
import { onMounted, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useTopicsStore } from '@/stores/topics'
import { useAuthStore } from '@/stores/auth'
import Comment from '@/components/commentItem.vue'

const route = useRoute()
const topicStore = useTopicsStore()
const authStore = useAuthStore()

const post = computed(() => {
  console.log('Current post:', topicStore.topic)
  return topicStore.topic
})
const errorMessage = computed(() => topicStore.error)
const commentContent = ref('')

const fetchPost = async () => {
  const postId = route.params.id
  await topicStore.getTopic(postId)
}

const submit = async (action, id) => {
  try {
    await topicStore.actionTopic(action, id)
  } catch (error) {
    console.error('Error fetching action:', error.message)
  }
}

const addComment = async () => {
  try {
    await topicStore.addComment(post.value._id, commentContent.value)
    commentContent.value = ''
  } catch (error) {
    console.log('error adding comment: ', error.message)
  }
}

onMounted(async () => {
  await fetchPost()
  console.log('POST: ', post.value)
})
</script>

<template>
  <div v-if="errorMessage">{{ errorMessage }}</div>
  <div v-else-if="!post.title">Loading...</div>
  <div v-else>
    <div>
      <h4 class="text-2xl font-semibold mb-3">Post</h4>
      <div class="card card-compact bg-neutral text-primary-content">
        <div class="card-body">
          <h2 class="card-title">
            <RouterLink :to="{ name: 'topic', params: { id: post._id } }"
              ><span class="mr-1">📌</span>{{ post.title }}</RouterLink
            >
          </h2>
          <p class="text-lg">
            {{ post.content }}
          </p>
          <p class="font-medium text-base">
            <RouterLink :to="{ name: 'profile', params: { id: post.author._id } }"
              >@{{ post.author.username }}</RouterLink
            >
          </p>
          <div class="card-actions">
            <form @submit.prevent="submit('like', post._id)">
              <button
                type="submit"
                :class="authStore.isAuthenticated ? '' : 'btn-disabled'"
                class="btn btn-outline btn-sm"
              >
                👍 {{ post.likeCount }}
              </button>
            </form>
            <form @submit.prevent="submit('dislike', post._id)">
              <button
                type="submit"
                :class="authStore.isAuthenticated ? '' : 'btn-disabled'"
                class="btn btn-outline btn-sm"
              >
                👎 {{ post.dislikeCount }}
              </button>
            </form>

            <button class="btn btn-outline btn-disabled btn-sm">💬 {{ post.commentCount }}</button>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-8">
      <h4 class="text-2xl font-semibold mb-3">Add Comment</h4>
      <div class="card card-compact bg-neutral">
        <div class="card-body">
          <form @submit.prevent="addComment">
            <div>
              <label class="form-control">
                <div class="label card-title">
                  <span class="label-text">✍🏻 Comment</span>
                </div>
                <textarea
                  v-model="commentContent"
                  class="textarea textarea-bordered h-24 max-h-52"
                  placeholder="Write your comment"
                ></textarea>
              </label>
            </div>
            <div class="card-actions mt-2">
              <button class="btn btn-sm">🚀 Send</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="mt-8">
      <h4 class="text-2xl font-semibold mb-3">Comments</h4>
      <div v-if="post.comments && post.comments.length > 0">
        <template v-for="comment in post.comments" :key="comment._id">
          <Comment :comment="comment"></Comment>
        </template>
      </div>
      <div v-else class="card card-compact bg-neutral">
        <div class="card-body">
          <h2 class="card-title">No comments yet.</h2>
        </div>
      </div>
    </div>
  </div>
</template>
