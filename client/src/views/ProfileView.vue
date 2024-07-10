<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTopicsStore } from '@/stores/topics'
import { useErrorStore } from '@/stores/error'
import Post from '@/components/postItem.vue'
import NotFound from '@/components/notFoundMessageItem.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const topicStore = useTopicsStore()
const errorStore = useErrorStore()

const userId = ref(route.params.id)
const userProfile = computed(() => authStore.userProfile)
const originalProfile = ref(null)
const userTopics = computed(() => topicStore.topics)
const isLoading = ref(false)
const notFound = ref(false)
const editable = ref(false)

const isOwnProfile = computed(() => {
  return authStore.userDetail.id === userId.value
})

const fetchUserProfile = async (id) => {
  if (authStore.isAuthenticated) {
    isLoading.value = true
    try {
      await authStore.getUserProfile(id)
      await topicStore.getTopicsByUser(id)
      originalProfile.value = { ...userProfile.value }
    } catch (error) {
      console.error('Error fetching user profile:', error.message)
      userProfile.value = null
      notFound.value = true
    } finally {
      isLoading.value = false
    }
  } else {
    // Kullanıcı hala giriş yapmamışsa, login sayfasına yönlendir
    router.push('/login')
  }
}

const editProfile = () => {
  if (isOwnProfile.value) {
    originalProfile.value = { ...userProfile.value }
    editable.value = true
  }
}

const cancelEdit = () => {
  authStore.setUserProfile({ ...originalProfile.value })
  editable.value = false
}

const saveProfile = async () => {
  if (isOwnProfile.value && editable.value) {
    const updatedProfile = {
      firstName: userProfile.value.firstName,
      lastName: userProfile.value.lastName,
      bio: userProfile.value.bio
      // Diğer güncellenebilir alanları buraya ekleyin
    }
    try {
      await authStore.updateProfile(userId.value, updatedProfile)
      editable.value = false
      await fetchUserProfile(userId.value) // Profil güncellendikten sonra yeni verileri çek
      console.log('Profile saved')
    } catch (error) {
      console.error('Profile güncellenirken bir hata oluştu:', error.message)
    }
  }
}

onMounted(async () => {
  await fetchUserProfile(userId.value)
})

watch(userId, (newVal) => {
  fetchUserProfile(newVal)
})
</script>

<template>
  <NotFound v-if="notFound" message="Kullanıcı bulunamadı"></NotFound>
  <h4 v-else class="text-2xl font-semibold mb-3">Profil Bilgileri</h4>

  <div v-if="isLoading" class="card card-compact bg-neutral">
    <div class="card card-body">
      <h2 class="card-title">Yükleniyor...</h2>
    </div>
  </div>

  <div v-else-if="userProfile">
    <div class="card card-compact bg-neutral">
      <div class="card-body">
        <h3 class="card-title font-semibold">@{{ userProfile.username }}</h3>
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <div class="font-bold">Ad:</div>
            <div>
              <span v-if="editable === false">
                {{ userProfile.firstName }}
              </span>
              <input
                v-else
                class="input input-sm"
                type="text"
                v-model="userProfile.firstName"
                :placeholder="userProfile.firstName"
                id="firstName"
              />
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div class="font-bold">Soyad:</div>
            <div>
              <span v-if="editable === false">
                {{ userProfile.lastName }}
              </span>
              <input
                v-else
                class="input input-sm"
                type="text"
                v-model="userProfile.lastName"
                :placeholder="userProfile.lastName"
                id="lastName"
              />
            </div>
          </div>
        </div>
        <div class="card-actions">
          <div v-if="isOwnProfile" class="mt-2 flex gap-2">
            <button
              class="btn btn-sm"
              @click="isOwnProfile && (editable ? cancelEdit() : editProfile())"
            >
              {{ editable ? 'İptal' : 'Profili Düzenle' }}
            </button>
            <button v-if="editable" class="btn btn-sm" @click="saveProfile">Kaydet</button>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8">
      <h4 class="text-2xl font-semibold mb-3">Paylaşımlar</h4>
      <div class="space-y-4">
        <NotFound v-if="errorStore.error" :message="errorStore.error"></NotFound>

        <div v-for="topic in userTopics" :key="topic._id">
          <Post :post="topic"></Post>
        </div>
      </div>
    </div>
  </div>
</template>
