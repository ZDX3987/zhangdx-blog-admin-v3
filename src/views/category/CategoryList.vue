<script setup lang="ts">

import {delCategory, getAllCategory, updateCategory} from "../../api/categoryApi.ts";
import {onMounted, ref} from "vue";
import {CategoryItem} from "../../type/CategoryItem.ts";
import {ResultPage} from "../../type/ResultPage.ts";
import {useRouter} from "vue-router";
import {ElMessage} from "element-plus";

const router = useRouter()

const isLoading = ref<boolean>(false)
const pageSize = ref<number>(15)
const currentPage = ref<number>(1)
const categoryTableList = ref<CategoryItem[]>()
const resultPage = ref<ResultPage<CategoryItem>>()


onMounted(() => {
  queryCategory(currentPage.value, pageSize.value)
})

function addCate() {
  router.push({name: 'CategoryAdd'})
}

function queryCategory(queryPage: number, queryPageSize: number) {
  isLoading.value = true
  getAllCategory(queryPageSize, queryPage).then(res => {
    let result = ResultPage.build<CategoryItem>(res.data, CategoryItem)
    categoryTableList.value = result.records
    result.records = []
    resultPage.value = result
    currentPage.value = result.current
    pageSize.value = result.size
    isLoading.value = false
  })
}

function doSaveCate(row: CategoryItem) {
  updateCategory(row).then(() => {
    ElMessage.success('保存成功')
  }).catch(error => ElMessage.error(error.msg))
}

function editCate(index: number, row: CategoryItem) {
  router.push({name: 'CategoryEdit', params: {modifyCategory: JSON.stringify(row)}})
}

function deleteCate(row: CategoryItem) {
  delCategory(row.id).then(() => {
    ElMessage.success('删除成功')
    currentChange(1)
  })
}

function sizeChange(changePageSize: number) {
  queryCategory(currentPage.value, changePageSize)
}
function currentChange(changePage: number) {
  queryCategory(changePage, pageSize.value)
}
</script>

<template>
<div class="category_list_content">
  <el-row>
    <el-col>
      <el-button-group class="btn-group">
        <el-button type="primary" @click="addCate()">新建标签</el-button>
      </el-button-group>
    </el-col>
  </el-row>
  <div class="category_list_table">
    <el-table :data="categoryTableList">
      <el-table-column label="序号" type="index" align="center" width="80"/>
      <el-table-column prop="cateName" label="名称" width="280" align="center"></el-table-column>
      <el-table-column prop="parentCate.cateName" label="父标签" width="280" align="center"></el-table-column>
      <el-table-column prop="articleCount" width="120" align="center">
        <template #header>
          <el-tooltip effect="dark" content="只包含已发布的文章数量" placement="top">
            <span>文章数量</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="是否启用" width="100" align="center">
        <template #default="scope">
          <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="doSaveCate(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" @click="editCate(scope.$index, scope.row)">编辑</el-button>
          <el-popconfirm
              confirmButtonText='好的'
              cancelButtonText='不用了'
              icon="el-icon-info"
              title="确定删除这个分类标签吗？"
              @confirm="deleteCate(scope.row)">
            <template #reference>
              <el-button type="danger" slot="reference">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="category_list_pagination">
      <el-pagination background layout="total, prev, pager, next, sizes, jumper" :current-page="currentPage" :page-size="pageSize"
                     :total="resultPage?.total" :page-sizes="[5,10,15,30]" @size-change="sizeChange" @current-change="currentChange" />
    </div>
  </div>
</div>
</template>

<style scoped>

.category_list_table {
  margin-top: 20px;
}
.category_list_pagination {
  margin-top: 20px;
}
</style>