<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getUserProfile } from '@/services/profiles/getProfile'
import { useAuthStore } from '@/stores/auth'
import Post from '@/components/postItem.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const userId = ref(route.params.id)
const userProfile = ref(null)
const userTopics = ref([])
const isLoading = ref(false)

const isOwnProfile = computed(() => {
  return authStore.userDetail.id === userId.value
})

const fetchUserProfile = async (id) => {
  isLoading.value = true
  try {
    const profileData = await getUserProfile(id)
    userProfile.value = profileData.user
    userTopics.value = profileData.topics || []
  } catch (error) {
    console.error('Error fetching user profile:', error.message)
    userProfile.value = null
    userTopics.value = []
  } finally {
    isLoading.value = false
  }
}

const editProfile = () => {
  if (isOwnProfile.value) {
    router.push({ name: 'editProfile', params: { id: userId.value } })
  }
}

onMounted(async () => {
  await authStore.attempt() // Kullanıcı bilgilerini güncelle
  fetchUserProfile(userId.value)
})

watch(userId, (newVal) => {
  fetchUserProfile(newVal)
})
</script>

<template>
  <div>
    <h2 class="text-4xl font-bold mb-6">Profil Sayfası</h2>
    <div v-if="isLoading" class="text-xl">Yükleniyor...</div>
    <div v-else-if="userProfile" class="space-y-4">
      <h3 class="text-3xl text-primary font-semibold">{{ userProfile.username }} Profili</h3>
      <div class="space-y-2">
        <p><span class="font-bold">Adı:</span> {{ userProfile.firstName }}</p>
        <p><span class="font-bold">Soyadı:</span> {{ userProfile.lastName }}</p>
        <p><span class="font-bold">Rolü:</span> {{ userProfile.role }}</p>
      </div>

      <div v-if="isOwnProfile" class="my-4">
        <button class="btn btn-primary" @click="editProfile">Profili Düzenle</button>
      </div>

      <div class="mt-8">
        <h4 class="text-2xl font-semibold mb-4">Paylaşılan Gönderiler</h4>
        <div class="space-y-4">
          <div v-for="topic in userTopics" :key="topic._id">
            <Post :post="topic"></Post>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-xl text-error">Profil bulunamadı veya yüklenirken bir hata oluştu.</div>
  </div>
</template>
