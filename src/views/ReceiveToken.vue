<script setup lang="ts">

import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {ElMessage} from "element-plus";
import {realLogin} from "../api/oauthApi.ts";

const route = useRoute()
const errCode = ref<number>()

onMounted(() => {
  const username = route.params.username
  errCode.value = Number(route.params.errCode)
  if (errCode.value === 4001) {
    ElMessage.warning({
      message: '当前账号已经关联本系统的其他账号，请先解绑',
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
    window.opener.location.reload()
    window.close()
  })

})
</script>

<template>
  <div>
    <div v-if="errCode === 4001">
      <p>本页面3秒后自动关闭</p>
    </div>
    <p v-else>登录成功</p>
  </div>
</template>

<style scoped>

</style>