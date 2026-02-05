<script setup lang="ts">

import {delCategory, getAllCategory, updateCategory} from "../../api/categoryApi.ts";
import {onMounted, ref} from "vue";
import {CategoryItem} from "../../type/CategoryItem.ts";
import {useRouter} from "vue-router";
import {ElMessage} from "element-plus";
import ListTable from "../../components/common/ListTable.vue";
import {
  AddConfig,
  DeleteConfig,
  EditConfig,
  ListTableConfig,
  ListTableDataMapping
} from "../../type/common/ListTableConfig.ts";

const router = useRouter()
const categoryListTableConfig = ref<ListTableConfig>(new ListTableConfig())


onMounted(() => {
  categoryListTableConfig.value = defineCategoryListTableConfig()
})

function defineCategoryListTableConfig(): ListTableConfig {
  const config: ListTableConfig = new ListTableConfig()
  config.addConfig = new AddConfig('新建标签', () => router.push({name: 'CategoryAdd'}))
  config.editConfig = new EditConfig((id: number) => router.push({name: 'CategoryEdit', params: {categoryId: id}}))
  config.deleteConfig = new DeleteConfig((id: number) => delCategory(id))
  config.queryConfig.queryFunc = (currentPage, pageSize) => getAllCategory(currentPage, pageSize)
  config.tableMappings = [
    ListTableDataMapping.defineIndexColumn(),
    ListTableDataMapping.defineCommonColumn('cateName', '名称', 280),
    ListTableDataMapping.defineCommonColumn('parentCate.cateName', '父标签名称', 280),
    ListTableDataMapping.defineCommonColumn('articleCount', '文章数量', 120)
        .addSlotTemplate('', 'articleCountHeader'),
    ListTableDataMapping.defineCommonColumn('status', '是否启用', 100)
        .addSlotTemplate('status'),
  ]
  return config
}

function doSaveCate(row: CategoryItem) {
  updateCategory(row).then(() => {
    ElMessage.success('保存成功')
  }).catch(error => ElMessage.error(error))
}
</script>

<template>
<div class="category_list_content">
  <ListTable :listTableConfig="categoryListTableConfig">
    <template #articleCountHeader>
      <el-tooltip effect="dark" content="只包含已发布的文章数量" placement="top">
        <span>文章数量</span>
      </el-tooltip>
    </template>
    <template #status="scope">
      <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @click="doSaveCate(scope.row)">
      </el-switch>
    </template>
  </ListTable>
</div>
</template>

<style scoped>
</style>