<script setup lang="ts">

import {onMounted, ref} from "vue";
import {deleteContentApi, getContentPage} from "../../api/content.ts";
import {useRouter} from "vue-router";
import ListTable from "../../components/common/ListTable.vue";
import {DeleteConfig, EditConfig, ListTableConfig, ListTableDataMapping} from "../../type/common/ListTableConfig.ts";

const router = useRouter()
const listTableConfig = ref<ListTableConfig>(new ListTableConfig())

onMounted(() => {
  listTableConfig.value = defineListTableConfig()
})

function defineListTableConfig(): ListTableConfig {
  let config: ListTableConfig = new ListTableConfig()
  config.queryConfig.queryFunc = (currentPage, pageSize) => getContentPage(currentPage, pageSize)
  config.tableMappings = [
    ListTableDataMapping.defineIndexColumn(),
    ListTableDataMapping.defineCommonColumn('name', '名称', 300, 'left'),
    ListTableDataMapping.defineCommonColumn('documentId', '文档ID', 300, 'left'),
    ListTableDataMapping.defineCommonColumn('router', '路由', 300, 'left'),
    ListTableDataMapping.defineDateColumn('updateDate', '更新时间', 180)
  ]
  config.deleteConfig = new DeleteConfig(id => deleteContentApi(id))
  config.editConfig = new EditConfig(id => {
    router.push({name: 'ContentEdit', params: {contentId: id}})
  })
  return config;
}

</script>

<template>
<div class="content_list_content">
  <ListTable :listTableConfig="listTableConfig">

  </ListTable>
</div>
</template>

<style scoped>

</style>