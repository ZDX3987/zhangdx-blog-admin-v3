<script setup lang="ts">

import {onMounted, reactive, ref} from "vue";
import {delArticle, download, getArticlePage, toCheckArticle} from "../../api/articelApi.ts";
import {ResultPage} from "../../type/ResultPage.ts";
import {ArticleItem} from "../../type/ArticleItem.ts";
import {dateFormat} from "../../utils/moment-date.ts";
import {ElMessage, type TableColumnCtx} from "element-plus";
import {useRouter} from "vue-router";
import {downloadMdFile} from "../../utils/file-util.ts";
import ArticlePreview from "./ArticlePreview.vue";

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

const articleList = ref<ArticleItem[]>([])
const resultPage = ref<ResultPage<ArticleItem>>()
const pageSize = ref<number>(10)
const currentPage = ref<number>(1)
const querySort = ref<number>(2)

const router = useRouter()

onMounted(() => {
  queryArticle(currentPage.value, pageSize.value)
})

function queryArticle(queryPage: number, queryPageSize: number) {
  isLoading.value = true
  let queryStatus = articleQueryForm.queryStatus
  if (!queryStatus || queryStatus.length === 0) {
    queryStatus = [0, 1, 2, 3];
  }
  getArticlePage(queryPageSize, queryPage, queryStatus, querySort.value, articleQueryForm.queryDate)
      .then(res => {
        let result = ResultPage.build<ArticleItem>(res.data, ArticleItem);
        articleList.value = result.records
        result.records = []
        resultPage.value = result
        currentPage.value = result.current
        pageSize.value = result.size
        isLoading.value = false
      })
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
function deleteArticle(row: ArticleItem) {
  delArticle(row.id).then(() => {
    queryArticle(1, pageSize.value)
    ElMessage.success('删除成功')
  })
}
function tableDateFormat(row: ArticleItem, column: TableColumnCtx<any>, cellValue: Date) {
  return cellValue ? dateFormat(cellValue) : '/'
}

function sizeChange(changePageSize: number) {
  queryArticle(currentPage.value, changePageSize)
}
function currentChange(changePage: number) {
  queryArticle(changePage, pageSize.value)
}

function previewArticle(row: ArticleItem) {
  router.push({name: 'ArticlePreview', params: {articleId: row.id}})
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
                   collapse-tags collapse-tags-tooltip>
          <el-option v-for="option in status" :label="option.name" :value="option.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="发布时间">
        <el-date-picker v-model="articleQueryForm.queryDate" type="daterange" range-separator="至" value-format="YYYY-MM-DD"
          start-placeholder="开始日期" end-placeholder="结束日期"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryArticle(currentPage, pageSize)">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="article_list_table">
    <el-table :data="articleList" @row-dblclick="previewArticle">
      <el-table-column label="序号" type="index" align="center" width="80"/>
      <el-table-column label="标题" prop="title" align="left" width="300"/>
      <el-table-column label="作者" prop="author.nickname" align="center" width="180"/>
      <el-table-column label="状态" prop="status" align="center" width="100">
        <template #default="scope">
          <el-tag  :type="status[scope.row.status].color">{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="来源" prop="articleType" align="center" width="100">
        <template #default="scope">
          <el-tag :type="articleTypeEnum[scope.row.articleType].color" round effect="plain">{{scope.row.articleType}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="标签" align="center" width="300">
        <template #default="scope">
          <span v-if="scope.row.categories.length > 0"
                v-for="(cate, index) in scope.row.categories">
              <el-divider v-if="index !== 0" direction="vertical"></el-divider>
              <span>{{cate.cateName}}</span>
            </span>
          <span v-else>/</span>
        </template>
      </el-table-column>
      <el-table-column label="存储格式" prop="source" align="center" width="120">
        <template #default="scope">
          <el-tag  :type="articleSourceEnum[scope.row.source].color" round effect="plain">{{articleSourceEnum[scope.row.source].name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" prop="publishDate" :formatter="tableDateFormat" sortable  align="center" width="180"></el-table-column>
      <el-table-column label="更新时间" prop="updateDate" :formatter="tableDateFormat" sortable align="center" width="180"></el-table-column>
      <el-table-column fixed="right" label="操作" align="center">
        <template #default="scope">
          <el-popconfirm v-if="status[scope.row.status].value === 2" title="该文章已经发布，需要撤回才能编辑，是否撤回"
                         @confirm="cancelPublish(scope.row)" width="200">
            <template #reference>
              <el-button type="primary">编辑</el-button>
            </template>
          </el-popconfirm>
          <el-button v-else type="primary" @click="editArticle(scope.row)">编辑</el-button>
          <el-button type="primary" @click="downloadArticle(scope.row)">下载</el-button>
          <el-popconfirm  width="200"
              title="确定删除吗？这将会删除和这篇文章相关的所有内容"
              @confirm="deleteArticle(scope.row)">
            <template #reference>
              <el-button type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="article_list_pagination">
      <el-pagination background layout="total, prev, pager, next, sizes, jumper" :current-page="currentPage" :page-size="pageSize"
                     :total="resultPage?.total" :page-sizes="[5,10,15,30]" @size-change="sizeChange" @current-change="currentChange" />
    </div>
  </div>
</div>
</template>

<style scoped>
.article_list_content {
  background-color: #FFF;
  padding: 20px;
  height: 90vh;
}
.article_list_pagination {
  margin-top: 20px;
}
/*修复elementplus的bug*/
.el-form--inline {
  .el-form-item {
    .el-input, .el-cascader, .el-select, .el-autocomplete {
      width: 150px;
    }
  }
}
</style>