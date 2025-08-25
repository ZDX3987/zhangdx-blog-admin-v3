<script setup lang="ts">

import {ref, watch} from "vue";
import {ArrowRight, Expand, Fold} from "@element-plus/icons-vue";
import {type RouteRecord, useRoute} from "vue-router";

const route = useRoute()
const menuCollapse = ref(false)
const emit = defineEmits(['collapseMenu'])

const routeList = ref<RouteRecord[]>([])

watch(() => route.fullPath,
    () => {
      routeList.value = route.matched
    },
    {immediate: true}
)

function menuCollapseMenuCollapse() {
  menuCollapse.value = !menuCollapse.value
  emit('collapseMenu', menuCollapse.value)
}
</script>

<template>
<div class="header_bar_content">
  <el-row type="flex" align="middle">
    <el-col :span="1">
      <span class="header_toggle_menu_btn" @click="menuCollapseMenuCollapse">
        <el-icon>
          <Expand v-if="menuCollapse"/>
          <Fold v-else />
        </el-icon>
      </span>
    </el-col>
    <el-col :span="12">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item v-for="item in routeList" :to="{ path: item.path }">{{item.meta.title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
  </el-row>
</div>
</template>

<style scoped>
.header_bar_content {
  height: 50px;
  background-color: #FFF;
  border-bottom: 1px solid #bfcbd9;
}
.header_toggle_menu_btn {
  font-size: 20px;
  margin-left: 20px;
  line-height: 50px;
}
</style>