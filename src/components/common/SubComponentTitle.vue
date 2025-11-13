<script setup lang="ts">

import {useRoute, useRouter} from "vue-router";

const route = useRoute()
const router = useRouter()

function goBack() {
  let matched = route.matched
  let parentRoute = matched[matched.length - 2]
  router.push(parentRoute)
}
</script>

<template>
  <el-page-header @back="goBack" class="page_header_content">
    <template #content>
      <span class="text-large font-600 mr-3"> {{route.meta.title}} </span>
    </template>
  </el-page-header>
</template>

<style scoped>
.page_header_content {
  margin-bottom: 20px;
}
</style>