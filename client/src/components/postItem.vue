<script setup>
const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="post-list">
    <div class="row">
      <div class="card">
        <router-link :to="{ name: 'topic', params: { id: props.post._id } }">
          <button type="button" class="fa-lg">Gönderiye Git</button>
        </router-link>
        <div class="card-body">
          <h1>Kullanıcı Adı: {{ props.post.authorName }}</h1>
          <p>Gönderi içeriği {{ props.post.title }}</p>
        </div>
        <div class="button-list">
          <div class="btn">
            <i class="fa-solid fa-comment fa-2xl"></i>
          </div>
          <div class="btn">
            <i class="fa-solid fa-heart fa-2xl"></i>
          </div>
          <div class="btn disabled">
            Like: {{ props.post.likeCount }} Dislike: {{ props.post.dislikeCount }} | Yorum sayısı:
            {{ props.post.commentCount }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
