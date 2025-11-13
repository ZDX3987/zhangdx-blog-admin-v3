<script setup lang="ts">

import SubComponentTitle from "../../components/common/SubComponentTitle.vue";
import {useRoute} from "vue-router";

const route = useRoute()
</script>

<template>
  <div class="category_manage_content">
    <SubComponentTitle v-if="route.redirectedFrom === undefined"/>
    <RouterView></RouterView>
  </div>
</template>

<style scoped>
.category_manage_content {
  background-color: #FFF;
  padding: 20px;
  height: 90vh;
}
</style>