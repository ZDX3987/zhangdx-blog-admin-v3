<script setup lang="ts">

import {onMounted, ref} from "vue";
import {getPermissionPages} from "../../api/permissionApi.ts";
import ListTable from "../../components/common/ListTable.vue";
import {DeleteConfig, EditConfig, ListTableConfig, ListTableDataMapping} from "../../type/common/ListTableConfig.ts";
import {useRouter} from "vue-router";

const router = useRouter()
const permissionTableConfig = ref<ListTableConfig>(new ListTableConfig())

onMounted(() => {
  permissionTableConfig.value = defineListTableConfig()
})

function defineListTableConfig(): ListTableConfig {
  const config: ListTableConfig = new ListTableConfig()
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
  config.deleteConfig = new DeleteConfig()
  config.editConfig = new EditConfig(id => {
    router.push({name: 'PermissionEdit', params: {permissionId: id}})
  })
  return config
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
        <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0">
        </el-switch>
      </template>
    </ListTable>
  </div>
</div>
</template>

<style scoped>

</style>