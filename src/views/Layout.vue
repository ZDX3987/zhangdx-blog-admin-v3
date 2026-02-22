<script setup lang="ts">

import MenuNav from "../components/layout/MenuNav.vue";
import HeaderBar from "../components/layout/HeaderBar.vue";
import {computed, onMounted, ref} from "vue";
import {getCurrUser} from "../api/oauthApi.ts";
import {toClass} from "../utils/to-class.ts";
import {AuthUserInfo} from "../type/AuthUserInfo.ts";

const menuCollapse = ref(false)
const authUserInfo = ref<AuthUserInfo>()
const authUsername = computed(() => {
  let value = authUserInfo.value;
  return value ? value.username : ''
})
const watermarkConfig = {
  rotate: -30,
  zIndex: 0,
  font: {fontSize: 14},
  gap: [200, 200] as [number, number],
}

onMounted(() => getAuthUserInfo())

function toggleMenuCollapse(value: boolean) {
  menuCollapse.value = value
}

function getAuthUserInfo() {
  getCurrUser().then(res => {
    authUserInfo.value = toClass(res.data, AuthUserInfo)
  })
}
</script>

<template>
<div class="layout_content">
  <el-watermark :content="authUsername" :gap="watermarkConfig.gap" :rotate="watermarkConfig.rotate"
                :z-index="watermarkConfig.zIndex" :font="watermarkConfig.font">
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
  </el-watermark>
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
  padding: 0;
  margin:10px;
  height: 90vh;
  background-color: #FFF;
}
</style>