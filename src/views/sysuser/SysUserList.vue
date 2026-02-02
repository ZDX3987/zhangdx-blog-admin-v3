<script setup lang="ts">

import ListTable from "../../components/common/ListTable.vue";
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {DeleteConfig, EditConfig, ListTableConfig, ListTableDataMapping} from "../../type/common/ListTableConfig.ts";
import {disableUser, getSysUserPages} from "../../api/sysUserApi.ts";
import type {SysUser} from "../../type/SysUser.ts";

const router = useRouter()
const sysUserListTableConfig = ref<ListTableConfig>(new ListTableConfig())

onMounted(() => {
  sysUserListTableConfig.value = defineSysUserListTableConfig()
})

function defineSysUserListTableConfig(): ListTableConfig {
  const config: ListTableConfig = new ListTableConfig()
  config.queryConfig.queryFunc = (currentPage, pageSize) => getSysUserPages(currentPage, pageSize)
  config.editConfig = new EditConfig((id: number) => router.push({name: 'SysUserEdit', params: {sysUserId: id}}))
  config.deleteConfig = new DeleteConfig((id: number) => disableUser(id, true), '禁用', '确定禁用该用户吗？')
  config.tableMappings = [
    ListTableDataMapping.defineIndexColumn(),
    ListTableDataMapping.defineCommonColumn('username', '用户名', 180, 'left'),
    ListTableDataMapping.defineCommonColumn('nickname', '昵称', 180, 'left'),
    ListTableDataMapping.defineCommonColumn('avatar', '头像', 80).addSlotTemplate('userAvatar'),
    ListTableDataMapping.defineCommonColumn('status', '是否启用', 120).addSlotTemplate('status'),
    ListTableDataMapping.defineCommonColumn('tel', '电话', 150, 'left'),
    ListTableDataMapping.defineCommonColumn('email', '邮箱', 150, 'left'),
    ListTableDataMapping.defineCommonColumn('roleList', '用户角色', 300)
        .addSlotTemplate('sysUserRole'),
    ListTableDataMapping.defineCommonColumn('socialUserVos', '第三方账号绑定', 400, 'left')
        .addSlotTemplate('socialUserBind'),
    ListTableDataMapping.defineDateColumn('createTime', '创建时间', 160)
  ]
  return config
}

function convertStatus(sysUser: SysUser) {
  disableUser(sysUser.id, !sysUser.status)
}
</script>

<template>
<div class="user_list_content">
  <ListTable :listTableConfig="sysUserListTableConfig">
    <template #userAvatar="scope">
      <el-avatar :size="40" :src="scope.row.avatar" />
    </template>
    <template #status="scope">
      <el-switch v-model="scope.row.status" :active-value="true" :inactive-value="false" @change="convertStatus(scope.row)">
      </el-switch>
    </template>
    <template #socialUserBind="scope">
      <el-avatar  v-for="socialUser in scope.row.socialUserVos" :key="socialUser.id"
                  :src="socialUser.avatar" :title="socialUser.source"/>
    </template>
    <template #sysUserRole="scope">
      <el-tag type="primary" v-for="role in scope.row.roleList">{{role.roleNameZh}}</el-tag>
    </template>
  </ListTable>
</div>
</template>

<style scoped>

</style>