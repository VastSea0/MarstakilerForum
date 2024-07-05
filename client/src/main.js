import '@fortawesome/fontawesome-free/css/all.min.css'
import '@/assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { authentication } from './plugins/authentication'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())

authentication.install().then(() => {
  app.use(router)
  app.mount('#app')
})
