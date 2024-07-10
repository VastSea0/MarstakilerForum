<script setup>
import { useAuthStore } from '@/stores/auth'
import { useErrorStore } from '@/stores/error'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import ErrorRegister from '@/components/notFoundMessageItem.vue'
const authStore = useAuthStore()
const errorStore = useErrorStore()
const router = useRouter()
const registerData = reactive({
  firstName: '',
  lastName: '',
  username: '',
  password: ''
})

async function submit() {
  const data = await authStore.register(registerData)
  console.log(data)
  if (data) {
    router.push('/login')
  }
}
</script>
<template>
  <h4 class="text-2xl font-semibold mb-3">📝 Register</h4>
  <div class="card card-compact bg-neutral mb-4">
    <div class="card-body">
      <form @submit.prevent="submit" autocomplete="off">
        <div class="flex flex-col gap-2">
          <div>
            <div>
              <strong>First name: </strong>
            </div>
            <div>
              <input
                type="text"
                class="input input-bordered w-full"
                name="firstName"
                v-model="registerData.firstName"
                id="firstName"
                required
                autocomplete="off"
              />
            </div>
          </div>
          <div>
            <div>
              <strong>Last name: </strong>
            </div>
            <div>
              <input
                type="text"
                class="input input-bordered w-full"
                name="lastName"
                v-model="registerData.lastName"
                id="lastName"
                required
                autocomplete="off"
              />
            </div>
          </div>
          <div>
            <div>
              <strong>Username: </strong>
            </div>
            <div>
              <label class="input input-bordered flex items-center w-full gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  class="h-4 w-4 opacity-70"
                >
                  <path
                    d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z"
                  />
                </svg>
                <input
                  type="text"
                  class="grow"
                  name="username"
                  v-model="registerData.username"
                  id="username"
                  required
                  autocomplete="off"
                />
              </label>
            </div>
          </div>
          <div>
            <div>
              <strong>Password: </strong>
            </div>
            <div>
              <label class="input input-bordered flex items-center w-full gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  class="h-4 w-4 opacity-70"
                >
                  <path
                    fill-rule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clip-rule="evenodd"
                  />
                </svg>
                <input
                  type="password"
                  class="grow"
                  name="password"
                  v-model="registerData.password"
                  id="password"
                  autocomplete="new-password"
                />
              </label>
            </div>
          </div>
          <div class="card-actions">
            <button type="submit" class="btn">Register</button>
          </div>
        </div>
      </form>
    </div>
  </div>
  <ErrorRegister v-if="errorStore.error" :message="errorStore.error"></ErrorRegister>
</template>
