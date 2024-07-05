<script setup>
import Sidebar from '/src/components/sidebarItem.vue'
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
  <div class="container text-center">
    <div class="row">
      <div class="col"></div>
      <div class="col-6">
        <div class="card">
          <div class="card-boy">
            <h3>Gönderi oluştur</h3>

            <div class="mb-3">
              <label for="gonderiFormText" class="form-label">Gönderi içeriği</label>
              <textarea class="form-control" id="gonderiFormText" rows="3"></textarea>
            </div>
            <div class="mb-3">
              <button type="submit" class="btn btn-primary mb-3" id="gonderiBtn">Gönder</button>
            </div>
          </div>
        </div>
        <!-- 
      GÖNDERİLERİN LİSTENECEĞİ YER
      -->
        <br />

        <div>
          <div v-if="errorMessage">{{ errorMessage }}</div>
          <div v-else-if="posts.length === 0">Loading...</div>
          <template v-else v-for="post in posts" :key="post._id">
            <Post :post="post"></Post>
          </template>
        </div>

        <br />
      </div>
      <div class="col">
        <Sidebar></Sidebar>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card h3 {
  margin-bottom: 10px;
}

.form-label {
  font-weight: bold;
}

#gonderiBtn {
  width: 100%;
}

.post-list {
  margin-top: 20px;
}

.card-body {
  padding: 15px;
  border-radius: 8px;

  margin-bottom: 15px;
}

.card-body h1 {
  margin-bottom: 5px;
}

.button-list {
  display: flex;
  justify-content: space-between;
}

.button-list .btn.disabled {
  background-color: #292929;
  cursor: default;
}
</style>
