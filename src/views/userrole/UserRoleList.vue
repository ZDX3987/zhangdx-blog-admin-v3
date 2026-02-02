<script setup lang="ts">

import ListTable from "../../components/common/ListTable.vue";
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {
  AddConfig,
  DeleteConfig,
  EditConfig,
  ListTableConfig,
  ListTableDataMapping
} from "../../type/common/ListTableConfig.ts";
import {deleteRole, doSaveRole, getRolePages} from "../../api/roleApi.ts";
import type {Role} from "../../type/Role.ts";
import {ElMessage} from "element-plus";

const router = useRouter()
const userRoleListTableConfig = ref<ListTableConfig>(new ListTableConfig())

onMounted(() => {
  userRoleListTableConfig.value = defineUserRoleListTableConfig()
})

function defineUserRoleListTableConfig(): ListTableConfig {
  const config: ListTableConfig = new ListTableConfig()
  config.addConfig = new AddConfig('新建角色', () => router.push({name: 'UserRoleAdd'}))
  config.editConfig = new EditConfig((id: number) => router.push({name: 'UserRoleEdit', params: {roleId: id}}))
  config.deleteConfig = new DeleteConfig((id: number) => deleteRole(id))
  config.queryConfig.queryFunc = (currentPage, pageSize) => getRolePages(currentPage, pageSize)
  config.tableMappings = [
    ListTableDataMapping.defineIndexColumn(),
    ListTableDataMapping.defineCommonColumn('roleName', '角色名', 300, 'left'),
    ListTableDataMapping.defineCommonColumn('roleNameZh', '角色中文名', 300, 'left'),
    ListTableDataMapping.defineCommonColumn('status', '是否启用', 100)
        .addSlotTemplate('status', '是否启用'),
    ListTableDataMapping.defineDateColumn('createdAt', '创建时间', 180),
    ListTableDataMapping.defineDateColumn('updatedAt', '更新时间', 180)
  ]
  return config
}

function changeStatus(row: Role) {
  let newStatus = row.status
  doSaveRole(row).then(() => ElMessage.success(newStatus ? '已启用' : '已禁用'))
}
</script>

<template>
<div class="user_role_list">
  <ListTable :listTableConfig="userRoleListTableConfig">
    <template #status="scope">
      <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="changeStatus(scope.row)">
      </el-switch>
    </template>
  </ListTable>
</div>
</template>

<style scoped>

</style>