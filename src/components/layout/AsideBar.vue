<script setup lang="ts">

import MenuNav from "./MenuNav.vue";

const title = 'ZHANGDX'

const props = defineProps({
  isCollapse: {
    type: Boolean,
    default: false
  }
})

function toBlogHome() {
  window.open('http://www.zhangdx.cn', '_blank', 'noopener,noreferrer');
}
</script>

<template>
<div class="aside-bar-wrapper">
  <h4 class="nav_title">{{ isCollapse ? title.slice(0, 1) : title }}</h4>
  <MenuNav class="aside-menu-nav" :isCollapse="isCollapse"/>
  <div class="aside-sub-btn">
    <el-tooltip effect="dark" content="博客主页" placement="top-start">
      <span class="aside-sub-btn-item" @click="toBlogHome">
        <span class="iconfont iconzhifeiji_fabu"></span>
      </span>
    </el-tooltip>

  </div>
</div>
</template>

<style scoped>
.aside-bar-wrapper {
  background-color: #304156;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.nav_title {
  margin: 0;
  height: 50px;
  line-height: 50px;
  flex-shrink: 0;
  color: #fff;
  text-align: center;
}
.aside-menu-nav {
  flex: 1;
}
.aside-sub-btn {
  border-top: 1px solid rgb(193, 193, 193);
  height: 60px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.aside-sub-btn-item {
  background-color: rgba(48,65,86,0.3);
  display: block;
  height: 30px;
  width: 30px;
  line-height: 30px;
  text-align: center;
  color: #FFF;
  border: 1px solid #FFF;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
}
.aside-sub-btn-item:hover {
  color: #55BD66;
  border: 1px solid #55BD66;
}
</style>