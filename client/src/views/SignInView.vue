<script setup>
import { useAuthStore } from '../../stores/auth'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const loginData = reactive({
  username: '',
  password: ''
})

const errorMessage = ref('')

async function submit() {
  try {
    await authStore.login(loginData)
    router.replace({ name: 'user' })
  } catch (err) {
    errorMessage.value = err.message
  }
}
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-6">
        <div class="card">
          <div class="form-container">
            <h2>Giriş Yap</h2>
            <form @submit.prevent="submit">
              <div class="form-group">
                <label for="username">Kullanıcı Adı</label>
                <input
                  ref="formData.username"
                  type="text"
                  class="form-control"
                  id="username"
                  placeholder="Kullanıcı adınızı girin"
                />
              </div>
              <div class="form-group">
                <label for="password">Şifre</label>
                <input
                  ref="formData.password"
                  type="password"
                  class="form-control"
                  id="password"
                  placeholder="Şifrenizi girin"
                />
              </div>
              <button type="submit" class="btn btn-primary" id="girisBtn">Giriş Yap</button>
            </form>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card">
          <div class="form-container">
            <h2>Kayıt Ol</h2>
            <form>
              <div class="form-group">
                <label for="kayitUserName">Kullanıcı Adınız</label>
                <input
                  type="text"
                  class="form-control"
                  id="kayitUserName"
                  placeholder="Adınızı ve soyadınızı girin"
                />
              </div>
              <div class="form-group">
                <label for="kayitUserEmail">E-posta Adresi</label>
                <input
                  type="email"
                  class="form-control"
                  id="kayitUserEmail"
                  placeholder="E-posta adresinizi girin"
                />
              </div>
              <div class="form-group">
                <label for="kayitUserPassword">Şifre</label>
                <input
                  type="password"
                  class="form-control"
                  id="kayitUserPassword"
                  placeholder="Yeni şifrenizi girin"
                />
              </div>
              <button type="submit" class="btn btn-primary" id="kayitBtn">Kayıt Ol</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
