<script setup lang="ts">

import MenuTreeTab from "./MenuTreeTab.vue";

const menuTabs = [
  {label: '客户端菜单', name: 'client'},
  {label: '管理端菜单', name: 'admin'},
]
</script>

<template>
  <el-tabs class="menu-manage-tabs" type="border-card">
    <el-tab-pane v-for="item in menuTabs" :key="item.name" :label="item.label">
      <MenuTreeTab :menuType="item.name"/>
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped>
.menu-manage-tabs {
  min-height: 100%;
}
</style>