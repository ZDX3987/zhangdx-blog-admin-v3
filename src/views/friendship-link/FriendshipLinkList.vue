<script setup lang="ts">

import {onMounted, ref} from "vue";
import {
  AddConfig,
  DeleteConfig,
  EditConfig,
  ListTableConfig,
  ListTableDataMapping
} from "../../type/common/ListTableConfig.ts";
import ListTable from "../../components/common/ListTable.vue";
import {deleteFriendshipLink, getFriendshipLinkPage} from "../../api/friendshipLinkApi.ts";
import {useRouter} from "vue-router";

const router = useRouter()
const friendshipLinkListTableConfig = ref<ListTableConfig>(new ListTableConfig())
const commonStatus = [
  {name: '待审核', type: 'warning'},
  {name: '无效', type: ''},
  {name: '有效', type: 'success'}
]

onMounted(() => {
  friendshipLinkListTableConfig.value = defineLinkListTableConfig()
})

function defineLinkListTableConfig(): ListTableConfig {
  const config = new ListTableConfig()
  config.addConfig = new AddConfig('新建友链', () => router.push({name: 'FriendshipLinkAdd'}))
  config.queryConfig.queryFunc = (currentPage, pageSize) => getFriendshipLinkPage(currentPage, pageSize)
  config.tableMappings = [
      ListTableDataMapping.defineIndexColumn(),
    ListTableDataMapping.defineCommonColumn('linkName', '网站名称', 180),
    ListTableDataMapping.defineCommonColumn('linkUrl', '网站地址', 300),
    ListTableDataMapping.defineCommonColumn('status', '状态')
        .addSlotTemplate('status'),
    ListTableDataMapping.defineCommonColumn('linkDesc', '网站描述', 300, 'left'),
  ]
  config.editConfig = new EditConfig((id: number) => router.push({name: 'FriendshipLinkEdit', params: {linkId: id}}))
  config.deleteConfig = new DeleteConfig((id: number) => deleteFriendshipLink(id))
  return config;
}

</script>

<template>
<ListTable :listTableConfig="friendshipLinkListTableConfig">
  <template #status="scope">
    <el-tag :type="commonStatus[scope.row.status + 1].type">{{commonStatus[scope.row.status + 1].name}}</el-tag>
  </template>
</ListTable>
</template>

<style scoped>

</style>