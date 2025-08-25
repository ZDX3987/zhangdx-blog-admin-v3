<script setup lang="ts">

import MenuNav from "../components/layout/MenuNav.vue";
import HeaderBar from "../components/layout/HeaderBar.vue";
import {ref} from "vue";

const menuCollapse = ref(false)
function toggleMenuCollapse(value: boolean) {
  menuCollapse.value = value
}
</script>

<template>
<div class="layout_content">
  <el-container>
    <MenuNav :is-collapse="menuCollapse"/>
    <el-container>
      <el-header>
        <HeaderBar @collapse-menu="toggleMenuCollapse"/>
      </el-header>
      <el-main>
        <RouterView/>
      </el-main>
    </el-container>
  </el-container>
</div>
</template>

<style scoped>
.layout_content {
  background-color: rgb(239,241,244);
}
.el-header {
  padding: 0;
}
.el-main {
  max-height: 95vh;
  padding: 10px;
}
</style>