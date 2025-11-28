<script setup lang="ts">

import {onMounted, ref} from "vue";
import {Permission} from "../../type/Permission.ts";
import type {TableColumnCtx} from "element-plus";
import {dateFormat} from "../../utils/moment-date.ts";
import {getPermissionPages} from "../../api/permissionApi.ts";
import {ResultPage} from "../../type/ResultPage.ts";

const permissionList = ref<Permission[]>([])

onMounted(() => {
  queryPermissionPages(1, 15)
})

function queryPermissionPages(currentPage: number, pageSize: number) {
  getPermissionPages(currentPage, pageSize).then(res => {
    permissionList.value = ResultPage.build(res.data, Permission).records
  })
}

function tableDateFormat(row: Permission, column: TableColumnCtx<any>, cellValue: any) {
  return dateFormat(cellValue)
}
</script>

<template>
<div>
  <div class="permission_list_table">
    <el-table :data="permissionList">
      <el-table-column label="序号" width="80" type="index" />
      <el-table-column label="代码" width="300" prop="permissionCode"/>
      <el-table-column label="名称" width="200" prop="name"/>
      <el-table-column label="权限类型" width="150" />
      <el-table-column prop="status" label="是否启用" width="100" align="center">
        <template #default="scope">
          <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createdAt" :formatter="tableDateFormat" sortable  align="center" width="180"></el-table-column>
      <el-table-column label="更新时间" prop="updatedAt" :formatter="tableDateFormat" sortable align="center" width="180"></el-table-column>
    </el-table>
  </div>
</div>
</template>

<style scoped>

</style>