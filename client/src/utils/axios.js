// Axios kütüphanesini içe aktarıyoruz. Bu, HTTP istekleri yapmamızı sağlayacak.
import axios from 'axios'

// API'nin temel URL'ini tanımlıyoruz. Tüm istekler bu URL'e gönderilecek.
// const BASE_URL = 'https://marstakilerforum.onrender.com/'
const BASE_URL = import.meta.env.VITE_BASE_URL

// Axios instance'ı oluşturmak için bir yardımcı fonksiyon tanımlıyoruz.
// Bu fonksiyon, özelleştirilebilir bir yapılandırma objesi alır.
const createAxiosInstance = (config = {}) => {
  // Yeni bir Axios instance'ı oluşturup döndürüyoruz.
  return axios.create({
    // Tüm istekler için temel URL'i ayarlıyoruz.
    baseURL: BASE_URL,
    // CORS politikalarına uygun olarak çerezleri göndermeyi etkinleştiriyoruz.
    withCredentials: true,
    // Varsayılan başlıkları ayarlıyoruz ve ek başlıkları ekliyoruz.
    headers: {
      'Content-Type': 'application/json',
      ...config.headers
    },
    // Diğer tüm yapılandırma seçeneklerini ekliyoruz.
    ...config
  })
}

// Genel kullanım için bir Axios instance'ı oluşturuyoruz.
export const axiosInstance = createAxiosInstance()
// Özel (kimlik doğrulamalı) kullanım için ayrı bir Axios instance'ı oluşturuyoruz.
export const axiosPrivateInstance = createAxiosInstance()
