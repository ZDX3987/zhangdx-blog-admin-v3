<script setup lang="ts">

import {onMounted, reactive} from "vue";
import {MenuItem} from "../../type/MenuItem.ts";
import {getAdminMenu} from "../../api/menuApi.ts";
import {genData} from "../../utils/api-util.ts";

const title = 'ZHANGDX'
const menuList = reactive<MenuItem[]>([])

const props = defineProps({
  isCollapse: {type: Boolean, default: false}
})

onMounted(() => {
  initAdminMenu()
})

function initAdminMenu() {
  genData(getAdminMenu()).then(data => {
    menuList.push(...data)
  })
}
</script>

<template>
  <el-scrollbar wrapClass="scrollbar-wrapper" class="bg_color">
    <h4 class="nav_title">{{ isCollapse ? 'Z' : title }}</h4>
    <el-menu :collapse="isCollapse"
             background-color="#304156"
             text-color="#bfcbd9"
             active-text-color="#409eff"
             class="menu_list">
      <template v-for="(menu, index) in menuList" :key="menu.id">
        <RouterLink  v-if="menu.childrenMenu.length === 0" :index="index + 1 + ''" :to="{path: menu.router}">
          <el-menu-item>
            <el-icon v-if="menu.iconClass" :class="menu.iconClass"></el-icon>
            <template #title>{{menu.text}}</template>
          </el-menu-item>
        </RouterLink>
        <el-sub-menu v-if="menu.childrenMenu.length > 0" :index="menu.id + '_'">
          <template #title>
            <el-icon :class="menu.iconClass"></el-icon>
            <span>{{menu.text}}</span>
          </template>
          <el-menu-item-group>
            <el-menu-item  v-for="(child, innerIndex) in menu.childrenMenu" :index="index + 1 + '_' + innerIndex + 1">
              <RouterLink :to="{path: child.router}">{{child.text}}</RouterLink>
            </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<style scoped>
.bg_color {
  background-color: #304156;
  height: 100%;
  min-height: 100vh;
}
.nav_title {
  margin: 0;
  height: 50px;
  line-height: 50px;
  color: #fff;
  text-align: center;
}
.menu_list {
  text-align: left;
  min-height: 100%;
  min-width: 100%;
}
.menu_list:not(.el-menu--collapse) {
  width: 200px;
}
a {
  color: #bfcbd9;
  text-decoration: none;
}
</style>