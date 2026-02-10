<script setup lang="ts">

import {DCaret} from "@element-plus/icons-vue";
import {onMounted, ref} from "vue";
import {MenuItem} from "../../type/MenuItem.ts";
import {deleteMenuItem, getMenuListByType, saveMenu, sortMenuList} from "../../api/menuApi.ts";
import {ElMessage} from "element-plus";
import MenuEditDialog from "../../components/dialog/MenuEditDialog.vue";

const menuList = ref<MenuItem[]>()
const menuEditDialogRef = ref<InstanceType<typeof MenuEditDialog>>()
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

function addTopLevelMenu() {
  menuEditDialogRef.value?.showDialog(new MenuItem())
}

function editMenu(editMenuItem: MenuItem) {
  menuEditDialogRef.value?.showDialog(editMenuItem)
}

function addChildMenu(parentMenu: MenuItem) {
  menuEditDialogRef.value?.showDialog(new MenuItem(), parentMenu)
}

function doSaveEditMenu(editMenuItem: MenuItem) {
  const menuId = editMenuItem.id
  if (!menuId) {
    editMenuItem.type = props.menuType === 'CLIENT' ? 1 : 2
    const hasParentMenu = !!editMenuItem.parentMenu
    const allMenuList: MenuItem[] = menuList.value || []
    if (hasParentMenu) {
      editMenuItem.parentId = editMenuItem.parentMenu?.id
      const childMenuList: MenuItem[] = allMenuList.filter(item => item.id === editMenuItem.parentId)
          .flatMap(item => item.childrenMenu).reverse()
      editMenuItem.seqNum = childMenuList.length + 1
    } else {
      editMenuItem.seqNum = allMenuList.length + 1
    }
    editMenuItem.level = hasParentMenu ? 2 : 1
    if (!editMenuItem.status) {
      editMenuItem.status = 0
    }
  }
  saveMenu(editMenuItem).then(() => {
    ElMessage.success('保存成功')
    getMenuList()
  }).catch(error => ElMessage.error(error))
}

function deleteMenu(menu: MenuItem) {
  deleteMenuItem(menu.id).then(() => {
    ElMessage.success('删除成功')
    getMenuList()
  }).catch(error => ElMessage.error(error))
}
function changeMenuStatus(menu: MenuItem) {
  doSaveEditMenu(menu)
}
</script>

<template>
  <div class="menu-edit-content">
    <el-button-group class="menu-edit-btn">
      <el-button type="primary" size="large" @click="addTopLevelMenu">添加一级菜单</el-button>
      <el-button type="primary" size="large" @click="sortMenu">
        <el-icon>
          <DCaret/>
        </el-icon>
        {{ sortable ? '完成' : '排序' }}
      </el-button>
    </el-button-group>
    <el-tree :data="menuList" :draggable="sortable" :expand-on-click-node="false"
             :props="{children: 'childrenMenu'}" node-key="id">
      <template #default="{ node, data }">
        <div class="menu-tree-node">
          <span class="menu-node-text">{{ data.text }}</span>
          <div>
            <el-switch class="menu-status-btn" size="small" v-model="data.status" :active-value="1"
                       :inactive-value="0" @click="changeMenuStatus(data)"/>
            <el-link class="menu-node-link" v-if="data.level < 2" type="primary" @click="addChildMenu(data)">
              添加子菜单
            </el-link>
            <el-link class="menu-node-link" type="primary" @click="editMenu(data)">编辑</el-link>
            <el-popconfirm
                :title="data.level === 1 && data.childrenMenu.length > 0 ? '删除一级菜单将会同时删除子菜单，确认删除吗？' : '确认删除这个菜单吗？'"
                @confirm="deleteMenu(data)">
              <template #reference>
                <el-link slot="reference" type="danger">删除</el-link>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </template>
    </el-tree>
  </div>
  <MenuEditDialog ref="menuEditDialogRef" @submitEditMenu="doSaveEditMenu"/>
</template>

<style scoped>
.menu-edit-btn {
  margin-bottom: 20px;
}

.menu-tree-node {
  width: 20%;
  display: flex;
  justify-content: space-between;
}

.menu-node-text {
  margin-right: 50px;
}

.menu-status-btn {
  margin-right: 50px;
}

.menu-node-link {
  margin-right: 10px;
}
</style>