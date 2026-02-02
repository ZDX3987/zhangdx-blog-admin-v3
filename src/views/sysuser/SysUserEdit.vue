<script setup lang="ts">

import SubComponentTitle from "../../components/common/SubComponentTitle.vue";
import EditForm from "../../components/common/EditForm.vue";
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {getUserInfo} from "../../api/sysUserApi.ts";
import {EditFormConfig, EditFormItem} from "../../type/common/EditFormConfig.ts";
import type {SysUser} from "../../type/SysUser.ts";

const sysUserEditFormConfig = ref<EditFormConfig>(new EditFormConfig())

const route = useRoute()
const router = useRouter()
const sysUserId = ref<number>()

onMounted(() => {
  sysUserEditFormConfig.value.resettable = false
  sysUserId.value = Number(route.params.sysUserId)
  getUserInfo(sysUserId.value).then(res => {
    sysUserEditFormConfig.value = defineSysUserEditFormConfig(res.data)
  })
})

function defineSysUserEditFormConfig(formValue: SysUser) {
  const formConfig = new EditFormConfig()
  formConfig.resettable = false
  formConfig.formItems = [
    EditFormItem.defineInputItem('昵称', 'nickname')
  ]
  formConfig.formValue = formValue
  return formConfig
}
</script>

<template>
<SubComponentTitle/>
  <EditForm :editFormConfig="sysUserEditFormConfig"/>
</template>

<style scoped>

</style>