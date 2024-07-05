<template>
  <div>
    <h2>Profil Sayfası</h2>
    <div v-if="isLoading">Yükleniyor...</div>
    <div v-else-if="userProfile">
      <h3 class="text-3xl text-red-900">{{ userProfile.username }} Profili</h3>
      <p>Adı: {{ userProfile.firstName }}</p>
      <p>Soyadı: {{ userProfile.lastName }}</p>
      <p>Rolü: {{ userProfile.role }}</p>
      <h4>Paylaşılan Gönderileri</h4>
      <ul>
        <li v-for="topic in userTopics" :key="topic._id">
          <router-link :to="{ name: 'topic', params: { id: topic._id } }">
            {{ topic.title }}
          </router-link>
        </li>
      </ul>
    </div>
    <div v-else>Profil bulunamadı veya yüklenirken bir hata oluştu.</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getUserProfile } from '@/services/profiles/getProfile'

const route = useRoute()
const userId = ref(route.params.id)
const userProfile = ref(null)
const userTopics = ref([])
const isLoading = ref(false)

const fetchUserProfile = async (id) => {
  isLoading.value = true
  try {
    const profile = await getUserProfile(id)
    userProfile.value = profile.user
    userTopics.value = profile.topics || []
  } catch (error) {
    console.error('Error fetching user profile:', error.message)
    userProfile.value = null
    userTopics.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchUserProfile(userId.value)
})

watch(userId, (newVal) => {
  fetchUserProfile(newVal)
})
</script>
