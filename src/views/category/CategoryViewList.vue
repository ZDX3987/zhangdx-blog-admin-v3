<script setup lang="ts">

import {onMounted, ref} from "vue";
import {CategoryViewConfig} from "../../type/CategoryViewConfig.ts";
import {getAllCategoryView} from "../../api/categoryViewApi.ts";
import {useRouter} from "vue-router";

const configList = ref<CategoryViewConfig[]>([]);

const router = useRouter()

onMounted(() => {
  queryCategoryViewList()
})

function queryCategoryViewList() {
  getAllCategoryView().then(res => {
    configList.value = res.data
  })
}

function addCategoryView() {
  router.push({name: 'CategoryViewAdd'})
}
</script>

<template>
<div class="category_view_list">
  <el-row>
    <el-col>
      <el-button-group class="btn-group">
        <el-button type="primary" @click="addCategoryView()">新建标签</el-button>
      </el-button-group>
    </el-col>
  </el-row>
  <el-table :data="configList">
    <el-table-column label="序号" type="index" align="center" width="80"/>
    <el-table-column label="视图名称" prop="name" align="left" width="200"></el-table-column>
    <el-table-column prop="status" label="是否启用" width="200" align="center">
      <template #default="scope">
        <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="save(scope.row)">
        </el-switch>
      </template>
    </el-table-column>
    <el-table-column label="标签" align="left" width="500">
      <template #default="scope">
        <span v-if="scope.row.itemList.length > 0"
              v-for="(item, index) in scope.row.itemList">
              <el-divider v-if="index !== 0" direction="vertical"></el-divider>
              <span>{{item.categoryName}}</span>
            </span>
        <span v-else>/</span>
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
</div>
</template>

<style scoped>

</style>