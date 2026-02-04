<script setup lang="ts">

import {onMounted, ref, watch} from "vue";
import {DeleteConfig, ListTableConfig, ListTableDataMapping} from "../../type/common/ListTableConfig.ts";
import ListTable from "../common/ListTable.vue";
import {getArticlePage} from "../../api/articelApi.ts";
import type {ArticleItem} from "../../type/ArticleItem.ts";

const selectArticleListTableConfig = ref<ListTableConfig>(new ListTableConfig())
const emit = defineEmits(['selectionChange', 'unselectArticle'])
const props = defineProps({
  dataSource: {
    type: Array,
    default: undefined
  },
})
const articleTypeEnum: any = {
  "原创": {color: "success"},
  "转载": {color: "warning"},
}

watch(props, (newProps) => {
  selectArticleListTableConfig.value.tableData = newProps.dataSource
})


onMounted(() => {
  selectArticleListTableConfig.value = defineSelectArticleListTableConfig()
})

function defineSelectArticleListTableConfig(): ListTableConfig {
  const config = new ListTableConfig()
  if (props.dataSource) {
    config.tableData = props.dataSource
  } else {
    config.queryConfig.queryFunc = (currentPage: number, pageSize: number) => queryArticle(currentPage, pageSize)
  }
  config.deleteConfig = new DeleteConfig((id: number) => deleteSelectArticle(id))
  config.tableMappings = [
    ListTableDataMapping.defineSelectionColumn(),
    ListTableDataMapping.defineIndexColumn(),
    ListTableDataMapping.defineCommonColumn('title', '文章标题', 300, 'left'),
    ListTableDataMapping.defineCommonColumn('articleType', '来源', 100)
        .addSlotTemplate('articleType'),
    ListTableDataMapping.defineCommonColumn('categories', '标签', 300)
        .addSlotTemplate('categories'),
    ListTableDataMapping.defineDateColumn('publishDate', '发布时间', 160)

  ]
  return config
}

function queryArticle(queryPage: number, queryPageSize: number) {
  let queryStatus = [0, 1, 2, 3]
  return getArticlePage(queryPageSize, queryPage, queryStatus, 1)
}

function selectionChange(newSelection: ArticleItem[]) {
  emit('selectionChange', newSelection)
}

function deleteSelectArticle(articleId: number): Promise<any> {
  let oldTableData = selectArticleListTableConfig.value.tableData || []
  selectArticleListTableConfig.value.tableData = oldTableData.filter(item => item.id !== articleId)
  emit('unselectArticle', articleId)
  return Promise.resolve()
}
</script>

<template>
  <ListTable :listTableConfig="selectArticleListTableConfig" :selectionChangeFunc="selectionChange">
    <template #articleType="scope">
      <el-tag :type="articleTypeEnum[scope.row.articleType].color" round effect="plain">{{ scope.row.articleType }}
      </el-tag>
    </template>
    <template #categories="scope">
          <span v-if="scope.row.categories.length > 0"
                v-for="(cate, index) in scope.row.categories">
              <el-divider v-if="index !== 0" direction="vertical"></el-divider>
              <span>{{ cate.cateName }}</span>
            </span>
      <span v-else>/</span>
    </template>
  </ListTable>
</template>

<style scoped>

</style>