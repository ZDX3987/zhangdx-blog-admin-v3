<script setup lang="ts">

import {useMainStore} from "../../pinia";
import {computed, type ComputedRef} from "vue";
import {AuthUserInfo} from "../../type/AuthUserInfo.ts";
import {logout} from "../../api/oauthApi.ts";
import {useRouter} from "vue-router";
import {removeAuthorization} from "../../utils/auth-storage.ts";
import {ElMessage} from "element-plus";

const router = useRouter()
const pinia = useMainStore()
const authUserInfo: ComputedRef<AuthUserInfo> = computed(() => {
  return pinia.authUserInfo || new AuthUserInfo()
})
const authUsernameText = computed(() => {
  return authUserInfo.value.nickname + '(' + authUserInfo.value.username + ')'
})


function handleUserAvatar(command: string) {
  switch (command) {
    case 'logout':
      logout().then(() => {
        removeAuthorization()
        ElMessage.success('退出成功')
        router.push({name: 'Login'})
      })
      break
  }
}
</script>

<template>
<div class="user-avatar-content">
  <el-dropdown @command="handleUserAvatar">
    <el-avatar :size="40" class="user-avatar" :src="authUserInfo.avatar"></el-avatar>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="account">
          <template #default>
            <div class="user-account-dropdown">
              <span class="user-account-name">{{authUsernameText}}</span>
              <div>
                <el-tag size="small" round type="primary">Tag 1</el-tag>
                <el-tag size="small" round type="success">Tag 2</el-tag>
                <el-tag size="small" round type="info">Tag 3</el-tag>
              </div>
            </div>
          </template>
        </el-dropdown-item>
        <el-dropdown-item command="logout" divided>退出</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>

</div>
</template>

<style scoped>
.user-account-dropdown {

}
.user-account-name {
  font-weight: 600;
}
</style>