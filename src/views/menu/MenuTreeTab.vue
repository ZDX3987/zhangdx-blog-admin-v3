<script setup lang="ts">

import {DCaret} from "@element-plus/icons-vue";
import {onMounted, ref} from "vue";
import type {MenuItem} from "../../type/MenuItem.ts";
import {getMenuListByType, sortMenuList} from "../../api/menuApi.ts";
import {ElMessage} from "element-plus";
import router from "../../router";

const menuList = ref<MenuItem[]>()
const props = defineProps({
  menuType: {
    type: String,
    default: ''
  }
})
const sortable = ref<boolean>(false)

onMounted(() => {
  getMenuList()
})

function getMenuList() {
  getMenuListByType(props.menuType.toUpperCase()).then(res => {
    menuList.value = res.data
  })
}

function sortMenu() {
  if (sortable.value && menuList.value) {
    sortMenuList(menuList.value).then(() => {
      getMenuList()
      ElMessage.success('保存成功')
    }).catch(() => ElMessage.error('保存失败'))
  }
  sortable.value = !sortable.value
}

function addMenu() {
  router.push({name: 'MenuAdd'})
}
function editMenu(menuId: number) {
  router.push({name: 'MenuEdit', params: {menuId: menuId}})
}
</script>

<template>
  <div class="menu-edit-content">
    <el-button-group class="menu-edit-btn">
      <el-button type="primary" size="large" @click="addMenu">添加一级菜单</el-button>
      <el-button type="primary" size="large" @click="sortMenu">
        <el-icon>
          <DCaret/>
        </el-icon>
        {{ sortable ? '完成' : '排序' }}
      </el-button>
    </el-button-group>
    <el-tree :data="menuList" show-checkbox :draggable="sortable" :expand-on-click-node="false"
             :props="{children: 'childrenMenu'}" node-key="id">
      <template #default="{ node, data }">
        <div class="menu-tree-node">
          <span class="menu-node-text">{{ data.text }}</span>
          <span>
          <el-link class="menu-node-link" v-if="data.level < 2" type="primary">添加子菜单</el-link>
          <el-link class="menu-node-link" type="primary" @click="editMenu(data.id)">编辑</el-link>
            <el-popconfirm :title="data.level === 1 && data.childrenMenu.length > 0 ? '删除一级菜单将会同时删除子菜单，确认删除吗？' : '确认删除这个菜单吗？'">
              <template #reference>
                <el-link slot="reference" type="danger">删除</el-link>
              </template>
            </el-popconfirm>
        </span>
        </div>
      </template>
    </el-tree>
  </div>
</template>

<style scoped>
.menu-edit-btn {
  margin-bottom: 20px;
}
.menu-tree-node {
  width: 50%;
  text-align: justify;
}

.menu-node-text {
  margin-right: 50px;
}
.menu-node-link {
  margin-right: 10px;
}
</style>