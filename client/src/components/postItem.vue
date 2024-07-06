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
    const response = await topicStore.actionTopic(action, id)
    console.log(response)
  } catch (error) {
    console.error('Error fetching action:', error.message)
  }
}
</script>

<template>
  <div class="card bg-neutral text-primary-content">
    <div class="card-body">
      <h2 class="card-title">
        <RouterLink :to="{ name: 'topic', params: { id: props.post._id } }">{{
          props.post.title
        }}</RouterLink>
      </h2>
      <p>
        <RouterLink :to="{ name: 'profile', params: { id: props.post.author } }">{{
          props.post.authorName
        }}</RouterLink>
      </p>
      <div class="card-actions">
        <form @submit.prevent="submit('like', props.post._id)">
          <button
            type="submit"
            :class="authStore.isAuthenticated ? '' : 'btn-disabled'"
            class="btn btn-outline btn-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="size-5 mr-2"
            >
              <path
                d="M1 8.25a1.25 1.25 0 1 1 2.5 0v7.5a1.25 1.25 0 1 1-2.5 0v-7.5ZM11 3V1.7c0-.268.14-.526.395-.607A2 2 0 0 1 14 3c0 .995-.182 1.948-.514 2.826-.204.54.166 1.174.744 1.174h2.52c1.243 0 2.261 1.01 2.146 2.247a23.864 23.864 0 0 1-1.341 5.974C17.153 16.323 16.072 17 14.9 17h-3.192a3 3 0 0 1-1.341-.317l-2.734-1.366A3 3 0 0 0 6.292 15H5V8h.963c.685 0 1.258-.483 1.612-1.068a4.011 4.011 0 0 1 2.166-1.73c.432-.143.853-.386 1.011-.814.16-.432.248-.9.248-1.388Z"
              />
            </svg>

            {{ props.post.likeCount }}
          </button>
        </form>
        <form @submit.prevent="submit('dislike', props.post._id)">
          <button
            type="submit"
            :class="authStore.isAuthenticated ? '' : 'btn-disabled'"
            class="btn btn-outline btn-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="size-5 mr-2"
            >
              <path
                d="M18.905 12.75a1.25 1.25 0 1 1-2.5 0v-7.5a1.25 1.25 0 0 1 2.5 0v7.5ZM8.905 17v1.3c0 .268-.14.526-.395.607A2 2 0 0 1 5.905 17c0-.995.182-1.948.514-2.826.204-.54-.166-1.174-.744-1.174h-2.52c-1.243 0-2.261-1.01-2.146-2.247.193-2.08.651-4.082 1.341-5.974C2.752 3.678 3.833 3 5.005 3h3.192a3 3 0 0 1 1.341.317l2.734 1.366A3 3 0 0 0 13.613 5h1.292v7h-.963c-.685 0-1.258.482-1.612 1.068a4.01 4.01 0 0 1-2.166 1.73c-.432.143-.853.386-1.011.814-.16.432-.248.9-.248 1.388Z"
              />
            </svg>
            {{ props.post.dislikeCount }}
          </button>
        </form>

        <button class="btn btn-outline btn-disabled btn-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="size-5 mr-2"
          >
            <path
              fill-rule="evenodd"
              d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902 1.168.188 2.352.327 3.55.414.28.02.521.18.642.413l1.713 3.293a.75.75 0 0 0 1.33 0l1.713-3.293a.783.783 0 0 1 .642-.413 41.102 41.102 0 0 0 3.55-.414c1.437-.231 2.43-1.49 2.43-2.902V5.426c0-1.413-.993-2.67-2.43-2.902A41.289 41.289 0 0 0 10 2ZM6.75 6a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Zm0 2.5a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5h-3.5Z"
              clip-rule="evenodd"
            />
          </svg>
          {{ props.post.commentCount }}
        </button>
      </div>
    </div>
  </div>
</template>
