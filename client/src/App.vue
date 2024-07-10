<script setup>
import { RouterView } from 'vue-router'
import Navbar from '@/components/navbarItem.vue'
</script>

<template>
  <header>
    <Navbar />
  </header>

  <div class="container max-w-screen-md mx-auto p-2 md:p-4 lg:p-6">
    <RouterView />
  </div>
</template>
