<script setup lang="ts">

import MenuEdit from "./MenuEdit.vue";

const menuTabs = [
  {label: '客户端菜单', name: 'client'},
  {label: '管理端菜单', name: 'admin'},
]

</script>

<template>
<div class="">
  <el-tabs type="border-card">
    <el-tab-pane v-for="item in menuTabs" :key="item.name" :label="item.label">
      <MenuEdit :menuType="item.name"/>
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<style scoped>

</style>