<script setup lang="ts">

import {ArticleStatus} from "../../type/ArticleStatus.ts";
import {onMounted, reactive, ref} from "vue";
import {delArticle, getArticlePage} from "../../api/articelApi.ts";
import {ResultPage} from "../../type/ResultPage.ts";
import {ArticleItem} from "../../type/ArticleItem.ts";
import {dateFormat} from "../../utils/moment-date.ts";
import {ElMessage} from "element-plus";

const articleStatus = ArticleStatus
const status: any = {
  "已保存": {name: "已保存", value: 0, color: ""},
  "待审核": {name: "待审核", value: 1, color: "warning"},
  "已发布": {name: "已发布", value: 2, color: "success"},
  "已删除": {name: "已删除", value: 3, color: "danger"}
}
const articleQueryForm = reactive({
  authorName: '',
  queryStatus: [0, 1, 2, 3],
  queryDate: null
})
const isLoading = ref<boolean>(false)

const articleList = ref<ArticleItem[]>([])
const resultPage = ref<ResultPage<ArticleItem>>()
const pageSize = ref<number>(10)
const currentPage = ref<number>(1)
const querySort = ref<number>(2)

onMounted(() => {
  queryArticle(currentPage.value, pageSize.value)
})

function queryArticle(queryPage: number, queryPageSize: number) {
  isLoading.value = true
  getArticlePage(queryPageSize, queryPage, articleQueryForm.queryStatus, querySort.value, articleQueryForm.queryDate)
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
function cancelPublish(row) {

}
function editArticle(row) {

}
function downloadArticle(row) {

}
function deleteArticle(row) {
  delArticle(row.id).then(() => {
    queryArticle(1, pageSize.value)
    ElMessage.success('删除成功')
  })
}
function tableDateFormat(row, column, cellValue) {
  return dateFormat(cellValue)
}

function sizeChange(changePageSize: number) {
  queryArticle(currentPage.value, changePageSize)
}
function currentChange(changePage: number) {
  queryArticle(changePage, pageSize.value)
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
        <el-select v-model="articleQueryForm.queryStatus" placeholder="请选择文章状态" clearable>
          <el-option v-for="(option, index) in articleStatus" :label="option" :value="index"/>
        </el-select>
      </el-form-item>
      <el-form-item label="发布时间">
        <el-date-picker v-model="articleQueryForm.queryDate" type="daterange"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="article_list_table">
    <el-table :data="articleList">
      <el-table-column label="序号" type="index"/>
      <el-table-column label="标题" prop="title"/>
      <el-table-column label="作者" prop="author.nickname"/>
      <el-table-column label="状态" prop="status">
        <template #default="scope">
          <el-tag  :type="status[scope.row.status].color">{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" prop="publishDate" :formatter="tableDateFormat" sortable></el-table-column>
      <el-table-column label="更新时间" prop="updateDate" :formatter="tableDateFormat" sortable></el-table-column>
      <el-table-column fixed="right" label="操作">
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
      <el-pagination background layout="total, prev, pager, next, sizes, jumper" :current-page="currentPage" :size="pageSize"
                     :total="resultPage?.total" :page-sizes="[5,10,15,30]" @size-change="sizeChange" @current-change="currentChange" />
    </div>
  </div>
</div>
</template>

<style scoped>
.article_list_content {
  background-color: #FFF;
  padding: 20px;
}
.article_list_pagination {
  margin-top: 20px;
}
</style>