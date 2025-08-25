<script setup lang="ts">

import {ArticleStatus} from "../../type/ArticleStatus.ts";
import {reactive} from "vue";

const articleStatus = ArticleStatus

const articleQueryForm = reactive({
  authorName: '',
  queryStatus: 0,
  startDate: '',
  endDate: ''
})

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
        <el-date-picker v-model="articleQueryForm.startDate" type="daterange"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="article_list_table">
    <el-table>
      <el-table-column label="序号" type="index"/>
      <el-table-column label="标题"/>
    </el-table>
  </div>
</div>
</template>

<style scoped>
.article_list_content {
  background-color: #FFF;
  padding: 20px;
}
</style>