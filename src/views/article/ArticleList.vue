<script setup lang="ts">

import {onMounted, reactive, ref} from "vue";
import {delArticle, download, getArticlePage, toCheckArticle} from "../../api/articelApi.ts";
import {ResultPage} from "../../type/ResultPage.ts";
import {ArticleItem} from "../../type/ArticleItem.ts";
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";
import {downloadMdFile} from "../../utils/file-util.ts";
import ListTable from "../../components/common/ListTable.vue";
import {DeleteConfig, EditConfig, ListTableConfig, ListTableDataMapping} from "../../type/common/ListTableConfig.ts";
import type {ApiResponse} from "../../api/axios.ts";

const status: any = {
  "已保存": {name: "已保存", value: 0, color: ""},
  "待审核": {name: "待审核", value: 1, color: "warning"},
  "已发布": {name: "已发布", value: 2, color: "success"},
  "已删除": {name: "已删除", value: 3, color: "danger"}
}
const articleTypeEnum:any = {
  "原创":{color:"success"},
  "转载":{color:"warning"},
}
const articleSourceEnum:any = {
  1:{color:"warning", name: '富文本'},
  2:{color:"success", name: 'Markdown'},
}
const articleQueryForm = reactive({
  authorName: '',
  queryStatus: [],
  queryDate: undefined,
})
const isLoading = ref<boolean>(false)
const querySort = ref<number>(2)
const articleTableRef = ref<InstanceType<typeof ListTable>>()

const router = useRouter()

const articleListTableConfig = ref<ListTableConfig>(new ListTableConfig())

onMounted(() => {
  articleListTableConfig.value = defineArticleListTableConfig()
})

function defineArticleListTableConfig(): ListTableConfig {
  const config = new ListTableConfig()
  config.queryConfig.queryFunc = (currentPage, pageSize) => queryArticle(currentPage, pageSize)
  config.editConfig = new EditConfig((_id: number, row: ArticleItem) => editArticle(row))
  config.deleteConfig = new DeleteConfig((id: number) => delArticle(id))
  config.tableMappings = [
    ListTableDataMapping.defineIndexColumn(),
      ListTableDataMapping.defineCommonColumn('title', '标题', 300, 'left')
          .addSlotTemplate('title'),
      ListTableDataMapping.defineCommonColumn('author.nickname', '作者', 150),
    ListTableDataMapping.defineCommonColumn('status', '是否启用', 100)
        .addSlotTemplate('status'),
    ListTableDataMapping.defineCommonColumn('articleType', '来源', 100)
        .addSlotTemplate('articleType'),
    ListTableDataMapping.defineCommonColumn('category', '标签', 300)
        .addSlotTemplate('category'),
    ListTableDataMapping.defineCommonColumn('source', '存储格式', 120)
        .addSlotTemplate('source'),
    ListTableDataMapping.defineDateColumn('publishDate', '发布时间', 180),
    ListTableDataMapping.defineDateColumn('updateDate', '更新时间', 180)
  ]
  return config;
}

function queryArticle(queryPage: number, queryPageSize: number): Promise<ApiResponse<ResultPage<ArticleItem>>> {
  isLoading.value = true
  let queryStatus = articleQueryForm.queryStatus
  if (!queryStatus || queryStatus.length === 0) {
    queryStatus = [0, 1, 2, 3];
  }
  return getArticlePage(queryPageSize, queryPage, queryStatus, querySort.value, articleQueryForm.queryDate)
}
function cancelPublish(row: ArticleItem) {
  toCheckArticle(row.id, 1).then(() => {
    ElMessage.success('取消审核成功')
    router.push({name: 'PublishArticle', params: {operate: 'update', article: row}})
  }).catch(() => ElMessage.error('取消审核失败'))
}
function editArticle(row: ArticleItem) {
  if (status[row.status].value === 2) {
    ElMessage.warning('该文章已发布，不可直接编辑')
    return
  }
  router.push({name: 'EditArticle', params: {articleId: row.id}})
}
function downloadArticle(row: ArticleItem) {
  if (row.source !== 2) {
    ElMessage.warning('仅能下载Markdown格式的文章')
    return
  }
  download(row.id).then(blob => {
    downloadMdFile(blob, row.title + '.md')
    ElMessage.success('下载成功')
  })
}

function submitQueryForm() {
  articleTableRef.value?.resetQuery()
}

</script>

<template>
<div class="article_list_content">
  <div class="article_list_search_form">
    <el-form :model="articleQueryForm" :inline="true" >
      <el-form-item label="作者">
        <el-input v-model="articleQueryForm.authorName" placeholder="请输入作者名字" clearable/>
      </el-form-item>
      <el-form-item label="文章状态">
        <el-select v-model="articleQueryForm.queryStatus" placeholder="请选择文章状态" clearable multiple
                   collapse-tags collapse-tags-tooltip style="width: 200px">
          <el-option v-for="option in status" :label="option.name" :value="option.value" :key="option.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="发布时间">
        <el-date-picker v-model="articleQueryForm.queryDate" type="daterange" range-separator="至" value-format="YYYY-MM-DD"
          start-placeholder="开始日期" end-placeholder="结束日期"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitQueryForm">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
  <ListTable :listTableConfig="articleListTableConfig" ref="articleTableRef">
    <template #title="scope">
      <RouterLink :to="{name: 'ArticlePreview', params: { articleId: scope.row.id.toString()}}">
        <el-link>{{scope.row.title}}</el-link>
      </RouterLink>
    </template>
    <template #status="scope">
      <el-tag :type="status[scope.row.status].color">{{scope.row.status}}</el-tag>
    </template>
    <template #articleType="scope">
      <el-tag :type="articleTypeEnum[scope.row.articleType].color" round effect="plain">{{scope.row.articleType}}</el-tag>
    </template>
    <template #category="scope">
      <span v-if="scope.row.categories.length > 0"
            v-for="(cate, index) in scope.row.categories">
              <el-divider v-if="index !== 0" direction="vertical"></el-divider>
              <span>{{cate.cateName}}</span>
            </span>
      <span v-else>/</span>
    </template>
    <template #source="scope">
      <el-tag  :type="articleSourceEnum[scope.row.source].color" round effect="plain">{{articleSourceEnum[scope.row.source].name}}</el-tag>
    </template>
  </ListTable>
</div>
</template>

<style scoped>
</style>