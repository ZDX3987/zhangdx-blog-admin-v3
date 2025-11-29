<script setup lang="ts">

import ListTable from "../../components/common/ListTable.vue";
import {onMounted, ref} from "vue";
import {DeleteConfig, EditConfig, ListTableConfig, ListTableDataMapping} from "../../type/common/ListTableConfig.ts";
import {getUpdateLogPage} from "../../api/updateLogApi.ts";
import {useRouter} from "vue-router";

const listTableConfig = ref<ListTableConfig>(new ListTableConfig())
const status: any = [
  {name: "已废弃", value: 0, color: "info"},
  {name: "已规划", value: 1, color: "primary"},
  {name: "测试中", value: 2, color: "warning"},
  {name: "已上线", value: 3, color: "success"}
]
const router = useRouter()

onMounted(() => {
  let config: ListTableConfig = new ListTableConfig()
  config.queryConfig.queryFunc = (currentPage, pageSize) => queryUpdateLog(currentPage, pageSize)
  config.tableMappings = [
      ListTableDataMapping.defineIndexColumn(),
      ListTableDataMapping.defineCommonColumn('title', '标题', 300, 'left'),
      ListTableDataMapping.defineCommonColumn('status', '状态', 300).addSlotTemplate('statusSlot'),
      ListTableDataMapping.defineDateColumn('updateDate', '更新时间', 180)
  ]
  config.deleteConfig = new DeleteConfig()
  config.editConfig = new EditConfig(id => {
    router.push({name: 'UpdateLogEdit', params: {logId: id}})
  })
  listTableConfig.value = config
})

async function queryUpdateLog(currentPage: number, pageSize: number) {
  return await getUpdateLogPage(currentPage, pageSize);
}

</script>

<template>
<div>
  <ListTable :listTableConfig="listTableConfig">
    <template #statusSlot="scope">
      <el-tag :type="status[scope.row.status].color">{{status[scope.row.status].name}}</el-tag>
    </template>
  </ListTable>
</div>
</template>

<style scoped>

</style>