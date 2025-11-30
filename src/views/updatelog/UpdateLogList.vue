<script setup lang="ts">

import ListTable from "../../components/common/ListTable.vue";
import {onMounted, ref} from "vue";
import {
  AddConfig,
  DeleteConfig,
  EditConfig,
  ListTableConfig,
  ListTableDataMapping
} from "../../type/common/ListTableConfig.ts";
import {deleteUpdateLog, getUpdateLogPage} from "../../api/updateLogApi.ts";
import {useRouter} from "vue-router";
import {updateLogStatus} from "../../type/common/commonStatusConst.ts";

const listTableConfig = ref<ListTableConfig>(new ListTableConfig())
const router = useRouter()

onMounted(() => {
  listTableConfig.value = defineListTableConfig()
})

function defineListTableConfig() {
  let config: ListTableConfig = new ListTableConfig()
  config.queryConfig.queryFunc = (currentPage, pageSize) => getUpdateLogPage(currentPage, pageSize)
  config.tableMappings = [
    ListTableDataMapping.defineIndexColumn(),
    ListTableDataMapping.defineCommonColumn('title', '标题', 300, 'left'),
    ListTableDataMapping.defineCommonColumn('status', '状态', 300).addSlotTemplate('statusSlot'),
    ListTableDataMapping.defineDateColumn('updateDate', '更新时间', 180)
  ]
  config.deleteConfig = new DeleteConfig(id => deleteUpdateLog(id))
  config.editConfig = new EditConfig(id => {
    router.push({name: 'UpdateLogEdit', params: {logId: id}})
  })
  config.addConfig = new AddConfig('新建日志', () => {
    router.push({name: 'UpdateLogAdd'})
  })
  return config;
}

</script>

<template>
<div>
  <ListTable :listTableConfig="listTableConfig">
    <template #statusSlot="scope">
      <el-tag :type="updateLogStatus[scope.row.status].color">{{updateLogStatus[scope.row.status].name}}</el-tag>
    </template>
  </ListTable>
</div>
</template>

<style scoped>

</style>