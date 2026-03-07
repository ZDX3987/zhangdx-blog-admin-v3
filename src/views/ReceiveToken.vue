<script setup lang="ts">

import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {ElMessage} from "element-plus";
import {realLogin} from "../api/oauthApi.ts";

const route = useRoute()
const errCode = ref<number>()

onMounted(() => {
  const username = route.query.username
  errCode.value = Number(route.query.errCode)
  let errorMsg = ''
  if (errCode.value) {
    switch (errCode.value) {
      case 4001:
        errorMsg = '当前账号已经关联本系统的其他账号，请先解绑'
        break
      case 403:
        errorMsg = '当前账号没有管理端系统权限，请联系管理员处理'
        break
    }
    ElMessage.warning({
      message: errorMsg,
      onClose: () => {
        window.close()
      }
    })
    return
  }
  if (!username) {
    window.opener.location.reload()
    window.close()
    return
  }
  realLogin(username).then(() => {
    window.opener.location.href = '/index'
    window.close()
  })

})
</script>

<template>
  <div>
    <p v-if="errCode">本页面3秒后自动关闭</p>
    <p v-else>登录成功</p>
  </div>
</template>

<style scoped>

</style>