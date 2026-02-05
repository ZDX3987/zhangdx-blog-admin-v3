<script setup lang="ts">

import {onMounted, ref} from "vue";
import {CategoryViewConfig} from "../../type/CategoryViewConfig.ts";
import {deleteCategoryView, editCategoryView, getAllCategoryView} from "../../api/categoryViewApi.ts";
import {useRouter} from "vue-router";
import ListTable from "../../components/common/ListTable.vue";
import {
  AddConfig,
  DeleteConfig,
  EditConfig,
  ListTableConfig,
  ListTableDataMapping
} from "../../type/common/ListTableConfig.ts";
import {ElMessage} from "element-plus";

const router = useRouter()
const categoryViewListTableConfig = ref<ListTableConfig>();

onMounted(() => {
  categoryViewListTableConfig.value = defineCategoryViewListTableConfig()
})

function addCategoryView() {
  router.push({name: 'CategoryViewAdd'})
}

function defineCategoryViewListTableConfig(): ListTableConfig {
  const config = new ListTableConfig()
  config.addConfig = new AddConfig('新建标签视图', addCategoryView)
  config.editConfig = new EditConfig((id: number) => router.push({name: 'CategoryViewEdit', params: {viewId: id}}))
  config.deleteConfig = new DeleteConfig((id: number) => deleteCategoryView(id))
  config.queryConfig.queryFunc = (current, pageSize) => getAllCategoryView(current, pageSize)
  config.tableMappings = [
      ListTableDataMapping.defineIndexColumn(),
      ListTableDataMapping.defineCommonColumn('name', '视图名称', 200, 'left'),
      ListTableDataMapping.defineCommonColumn('status', '是否启用', 100)
        .addSlotTemplate('status'),
    ListTableDataMapping.defineCommonColumn('itemList', '标签', 500, 'left')
        .addSlotTemplate('cateList'),
  ]
  return config;
}

function editConfigStatus(row: CategoryViewConfig) {
  row.categoryIds = row.itemList.map(item => item.categoryId)
  editCategoryView(row).then(() => ElMessage.success('修改成功'))
      .catch(error => ElMessage.error(error))
}
</script>

<template>
  <ListTable :listTableConfig="categoryViewListTableConfig">
    <template #status="scope">
      <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @click="editConfigStatus(scope.row)">
      </el-switch>
    </template>
    <template #cateList="scope">
        <span v-if="scope.row.itemList.length > 0" v-for="(item, index) in scope.row.itemList">
              <el-divider v-if="index !== 0" direction="vertical"></el-divider>
              <span>{{item.categoryName}}</span>
            </span>
      <span v-else>/</span>
    </template>
  </ListTable>
</template>

<style scoped>

</style>