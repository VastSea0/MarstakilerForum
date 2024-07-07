<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getUserProfile } from '@/services/profiles/getProfile'
import { useAuthStore } from '@/stores/auth'
import { useTopicsStore } from '@/stores/topics'
import Post from '@/components/postItem.vue'

const route = useRoute()
const authStore = useAuthStore()
const topicStore = useTopicsStore()

const userId = ref(route.params.id)
const userProfile = ref(null)
const originalProfile = ref(null)
const userTopics = computed(() => topicStore.topics)
const isLoading = ref(false)
const notFound = ref(false)
const editable = ref(false)

const isOwnProfile = computed(() => {
  return authStore.userDetail.id === userId.value
})

const fetchUserProfile = async (id) => {
  isLoading.value = true
  try {
    const profileData = await getUserProfile(id)
    userProfile.value = profileData.user
    originalProfile.value = profileData.user
    await topicStore.getTopicsByUser(id)
  } catch (error) {
    console.error('Error fetching user profile:', error.message)
    userProfile.value = null
    notFound.value = true
  } finally {
    isLoading.value = false
  }
}

const editProfile = () => {
  if (isOwnProfile.value) {
    editable.value = !editable.value
  }
}

const cancelEdit = () => {
  // Edit modu iptal edildiğinde, geçici olarak saklanan orijinal profili geri yükle
  userProfile.value = { ...originalProfile.value }
  editable.value = false
}
const saveProfile = async () => {
  if (isOwnProfile.value && editable.value) {
    const updatedProfile = {
      firstName: userProfile.value.firstName,
      lastName: userProfile.value.lastName
    }
    try {
      await authStore.updateProfile(userId.value, updatedProfile)
      editable.value = false
      await fetchUserProfile(userId.value) // Profil güncellendikten sonra yeni verileri çek
      console.log('Profile saved')
    } catch (error) {
      console.log('Profile güncellenirken bir hata oluştu:', error.message)
    }
  }
}

onMounted(async () => {
  await authStore.attempt() // Kullanıcı bilgilerini güncelle
  await fetchUserProfile(userId.value)
})

watch(userId, (newVal) => {
  fetchUserProfile(newVal)
})
</script>

<template>
  <h4 class="text-2xl font-semibold mb-3">Profile</h4>

  <div v-if="isLoading" class="card card-compact bg-neutral">
    <div class="card card-compact-body">
      <h2 class="card-title">Loading...</h2>
    </div>
  </div>

  <div v-else-if="userProfile">
    <div class="card card-compact bg-neutral">
      <div class="card-body">
        <h3 class="card-title font-semibold">@{{ userProfile.username }}</h3>
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <div class="font-bold">Name:</div>
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
            <div class="font-bold">Surname:</div>
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
            <button class="btn btn-sm" @click="editable ? cancelEdit() : editProfile()">
              {{ editable ? 'Cancel' : 'Edit Profile' }}
            </button>
            <button v-if="editable" class="btn btn-sm" @click="saveProfile">Save</button>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8">
      <h4 class="text-2xl font-semibold mb-3">Posts</h4>
      <div class="space-y-4">
        <div v-for="topic in userTopics" :key="topic._id">
          <Post :post="topic"></Post>
        </div>
      </div>
    </div>
  </div>
  <div v-if="notFound" class="card card-compact bg-neutral">
    <div class="card-body">
      <h2 class="card-title">User Not Found</h2>
    </div>
  </div>
</template>
