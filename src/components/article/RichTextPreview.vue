<script setup lang="ts">

const props = defineProps({
  richText: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="vditor-reset" v-html="richText"></div>
</template>

<style scoped>
</style>