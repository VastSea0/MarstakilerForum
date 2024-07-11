<script setup>
import Post from '@/components/postItem.vue'
import NoPost from '@/components/notFoundMessageItem.vue'
import { ref, onMounted, computed } from 'vue'
import { useTopicsStore } from '@/stores/topics'
import { useErrorStore } from '@/stores/error'

const topicStore = useTopicsStore()
const errorStore = useErrorStore()
const errorMessage = ref('')
const addPost = ref(false)
const newPost = ref({
  title: '',
  content: ''
})
const submit = async () => {
  await topicStore.addTopic(newPost.value)
}

// topics'i store'dan computed olarak alıyoruz
const posts = computed(() => topicStore.topics)

const fetchPosts = async () => {
  try {
    await topicStore.getAllTopics()
  } catch (error) {
    errorMessage.value = error || 'Failed to fetch posts'
    console.error('Error fetching posts:', error)
  }
}

onMounted(async () => {
  await fetchPosts()
})
</script>
<template>
  <template v-if="posts.length === 0">
    <NoPost v-if="errorStore.error" :message="errorStore.error.toString()"></NoPost>
  </template>
  <div v-else>
    <h4 class="text-2xl font-semibold mb-3">Gönderiler</h4>

    <template v-for="post in posts" :key="post._id">
      <Post :post="post"></Post>
    </template>
  </div>
  <Transition name="slide-fade">
    <div
      v-if="addPost"
      class="fixed bottom-16 md:bottom-20 left-1/2 transform -translate-x-1/2 flex place-content-center w-full"
    >
      <div class="container max-w-screen-md mx-auto p-2 md:p-4 lg:p-6">
        <div class="card card-compact bg-neutral shadow-2xl w-full">
          <div class="card-body">
            <div class="card-title">✍🏻 Gönderi oluştur</div>
            <form @submit.prevent="submit">
              <div>
                <label class="form-control w-full">
                  <div class="label">
                    <span class="label-text">Başlık</span>
                  </div>
                  <input
                    type="text"
                    v-model="newPost.title"
                    placeholder="Başlık girin"
                    class="input input-bordered input-sm w-full"
                  />
                </label>
              </div>
              <div>
                <label class="form-control">
                  <div class="label card-title">
                    <span class="label-text">İçerik</span>
                  </div>
                  <textarea
                    v-model="newPost.content"
                    class="textarea textarea-bordered h-24 max-h-52"
                    placeholder="Detayları yazın"
                  ></textarea>
                </label>
              </div>
              <div>
                <button class="btn btn-sm mt-2" type="submit">Gönder</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </Transition>
  <div class="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex place-content-center w-full">
    <button @click="addPost = !addPost" class="btn md:btn-lg btn-circle btn-neutral shadow-md">
      {{ addPost ? 'Kapat' : 'Ekle' }}
    </button>
  </div>
</template>
<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
