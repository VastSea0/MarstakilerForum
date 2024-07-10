<script setup>
const props = defineProps({
  message: String
})
</script>
<template>
  <div class="card card-compact bg-neutral">
    <div class="card-body">
      <div class="card-title">{{ props.message }}</div>
    </div>
  </div>
</template>
