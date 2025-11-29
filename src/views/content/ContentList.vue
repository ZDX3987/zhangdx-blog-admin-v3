<script setup lang="ts">

import {onMounted, ref} from "vue";
import {ContentItem} from "../../type/ContentItem.ts";
import {ArticleItem} from "../../type/ArticleItem.ts";
import {ElMessage, type TableColumnCtx} from "element-plus";
import {dateFormat} from "../../utils/moment-date.ts";
import {deleteContentApi, getContentPage} from "../../api/content.ts";
import {ResultPage} from "../../type/ResultPage.ts";
import {useRouter} from "vue-router";

const contentList = ref<ContentItem[]>([])
const pageSize = ref<number>(10)
const currentPage = ref<number>(1)
const router = useRouter()

onMounted(() => {
  queryContent(currentPage.value, pageSize.value)
})

function queryContent(current: number, pageSize: number) {
  getContentPage(current, pageSize).then(res => {
    contentList.value = ResultPage.build(res.data, ContentItem).records

  })
}

function editContent(row: ContentItem) {
  router.push({name: 'ContentEdit', params: {contentId: row.id}})
}

function deleteContent(row: ContentItem) {
  deleteContentApi(row.id).then(res => {
    ElMessage.success("删除成功")
  }).catch(error => ElMessage.error(error))
}

function tableDateFormat(row: ArticleItem, column: TableColumnCtx<any>, cellValue: any) {
  return dateFormat(cellValue)
}
</script>

<template>
<div class="content_list_content">
  <div class="content_list_table">
    <el-table :data="contentList">
      <el-table-column label="序号" width="100" type="index" />
      <el-table-column width="300" label="名称" prop="name"></el-table-column>
      <el-table-column width="300" label="文档ID" prop="documentId"></el-table-column>
      <el-table-column width="500" label="路由" prop="router"></el-table-column>
      <el-table-column width="300" label="最后修改时间" :formatter="tableDateFormat" prop="updateDate"></el-table-column>
      <el-table-column fixed="right" label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" @click="editContent(scope.row)">编辑</el-button>
          <el-popconfirm title="确定删除吗？" @confirm="deleteContent(scope.row)">
            <template #reference>
              <el-button type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</div>
</template>

<style scoped>

</style>