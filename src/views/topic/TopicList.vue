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
import {useRouter} from "vue-router";
import {getTopicPages} from "../../api/topicApi.ts";

const router = useRouter()
const topicListTableConfig = ref<ListTableConfig>();

onMounted(() => {
  topicListTableConfig.value = defineTopicListTableConfig()
})

function defineTopicListTableConfig(): ListTableConfig {
  const config = new ListTableConfig()
  config.addConfig = new AddConfig('新建专栏', () => router.push({name: 'TopicAdd'}))
  config.editConfig = new EditConfig((id: number) => router.push({name: 'TopicEdit', params: {viewId: id}}))
  config.deleteConfig = new DeleteConfig((id: number) => {})
  config.queryConfig.queryFunc = (current, pageSize) => getTopicPages(current, pageSize)
  config.tableMappings = [
    ListTableDataMapping.defineIndexColumn(),
    ListTableDataMapping.defineCommonColumn('title', '标题', 200, 'left'),
    ListTableDataMapping.defineCommonColumn('articleCount', '文章数量', 100),
      ListTableDataMapping.defineDateColumn('createDate', '创建时间', 160),
  ]
  return config;
}
</script>

<template>
  <ListTable :listTableConfig="topicListTableConfig"></ListTable>
</template>

<style scoped>

</style>