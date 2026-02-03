<script setup lang="ts">

import {onMounted, ref} from "vue";
import {deletePermission, doSavePermission, getPermissionPages} from "../../api/permissionApi.ts";
import ListTable from "../../components/common/ListTable.vue";
import {
  AddConfig,
  DeleteConfig,
  EditConfig,
  ListTableConfig,
  ListTableDataMapping
} from "../../type/common/ListTableConfig.ts";
import {useRouter} from "vue-router";
import type {Role} from "../../type/Role.ts";
import {ElMessage} from "element-plus";
import type {Permission} from "../../type/Permission.ts";

const router = useRouter()
const permissionTableConfig = ref<ListTableConfig>(new ListTableConfig())

onMounted(() => {
  permissionTableConfig.value = defineListTableConfig()
})

function defineListTableConfig(): ListTableConfig {
  const config: ListTableConfig = new ListTableConfig()
  config.addConfig = new AddConfig('新建权限', () => router.push({name: 'PermissionAdd'}))
  config.queryConfig.queryFunc = (currentPage, pageSize) => getPermissionPages(currentPage, pageSize)
  config.tableMappings = [
    ListTableDataMapping.defineIndexColumn(),
    ListTableDataMapping.defineCommonColumn('permissionCode', '代码', 300, 'left'),
    ListTableDataMapping.defineCommonColumn('name', '名称', 200, 'left'),
    ListTableDataMapping.defineCommonColumn('resourceTypeName', '权限类型', 150)
        .addSlotTemplate('resourceType', '权限类型'),
    ListTableDataMapping.defineCommonColumn('status', '是否启用', 100)
        .addSlotTemplate('status', '是否启用'),
    ListTableDataMapping.defineDateColumn('createdAt', '创建时间', 180),
    ListTableDataMapping.defineDateColumn('updatedAt', '更新时间', 180)
  ]
  config.deleteConfig = new DeleteConfig((id: number) => deletePermission(id))
  config.editConfig = new EditConfig((id: number) => {
    router.push({name: 'PermissionEdit', params: {permissionId: id}})
  })
  return config
}

function changeStatus(row: Permission) {
  let newStatus = row.status
  doSavePermission(row).then(() => ElMessage.success(newStatus ? '已启用' : '已禁用'))
}
</script>

<template>
<div>
  <div class="permission_list_table">
    <ListTable :listTableConfig="permissionTableConfig">
      <template #resourceType="scope">
        <el-tag>{{scope.row.resourceTypeName}}</el-tag>
      </template>
      <template #status="scope">
        <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @click="changeStatus(scope.row)">
        </el-switch>
      </template>
    </ListTable>
  </div>
</div>
</template>

<style scoped>

</style>