<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {ListTableConfig, ListTableDataMapping} from "../../type/common/ListTableConfig.ts";
import {getAllCategory} from "../../api/categoryApi.ts";
import ListTable from "../common/ListTable.vue";
import type {CategoryItem} from "../../type/CategoryItem.ts";

const dialogTableVisible = ref<boolean>(false)
const router = useRouter()
const categoryListTableConfig = ref<ListTableConfig>(new ListTableConfig())
const emit = defineEmits(['selectSingleCategory'])

defineExpose({
  showDialog
})

onMounted(() => {
  categoryListTableConfig.value = defineCategoryListTableConfig()
})

function defineCategoryListTableConfig(): ListTableConfig {
  const config: ListTableConfig = new ListTableConfig()
  config.queryConfig.queryFunc = (currentPage, pageSize) => getAllCategory(currentPage, pageSize)
  config.highlightCurrentRow = true
  config.tableMappings = [
    ListTableDataMapping.defineIndexColumn(),
    ListTableDataMapping.defineCommonColumn('cateName', '名称', 180),
    ListTableDataMapping.defineCommonColumn('parentCate.cateName', '父标签名称', 180),
    ListTableDataMapping.defineCommonColumn('articleCount', '文章数量', 100)
        .addSlotTemplate('', 'articleCountHeader')
  ]
  return config
}

function showDialog() {
  dialogTableVisible.value = true
}

function closeDialog() {
  dialogTableVisible.value = false
}

function selectSingleRow(row: CategoryItem) {
  emit('selectSingleCategory', row)
  closeDialog()
}
</script>

<template>
<el-dialog v-model="dialogTableVisible" title="请选择标签" width="600" @close="closeDialog">
  <ListTable :listTableConfig="categoryListTableConfig" @selectSingleRow="selectSingleRow">
    <template #articleCountHeader>
      <el-tooltip effect="dark" content="只包含已发布的文章数量" placement="top">
        <span>文章数量</span>
      </el-tooltip>
    </template>
  </ListTable>
</el-dialog>
</template>

<style scoped>

</style>