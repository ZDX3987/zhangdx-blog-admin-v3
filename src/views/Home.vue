<script setup lang="ts">
import {useMainStore} from "../pinia";
import {computed, type ComputedRef} from "vue";
import {AuthUserInfo} from "../type/AuthUserInfo.ts";

const pinia = useMainStore()
const authUserInfo: ComputedRef<AuthUserInfo> = computed(() => {
  return pinia.authUserInfo || new AuthUserInfo()
})
</script>

<template>
<div class="home-content">
  <el-row>
    <el-col :span="8">
      <el-card>
        <template #header>
          <span>
            {{'欢迎您，' + authUserInfo.nickname}}
          </span>
          <el-tag type="success" effect="light" round size="small" v-if="authUserInfo.roleList.length > 0">{{authUserInfo.roleList[0].roleNameZh}}</el-tag>
          <span>{{'您已注册' + 123 + '天'}}</span>
        </template>
      </el-card>
    </el-col>
  </el-row>
</div>
</template>

<style scoped>
.home-content {
  margin: 10px;
}
</style>