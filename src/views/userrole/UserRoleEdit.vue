<script setup lang="ts">

import SubComponentTitle from "../../components/common/SubComponentTitle.vue";
import EditForm from "../../components/common/EditForm.vue";
import {onMounted, ref} from "vue";
import {EditFormConfig, EditFormItem, SubmitConfig} from "../../type/common/EditFormConfig.ts";
import {useRoute, useRouter} from "vue-router";
import {Role} from "../../type/Role.ts";
import {doSaveRole, getRoleItem} from "../../api/roleApi.ts";
import {ElMessage} from "element-plus";

const roleEditFormConfig = ref<EditFormConfig>(new EditFormConfig())
const route = useRoute()
const router = useRouter()
const roleId = ref<number>()

onMounted(() => {
  roleId.value = Number(route.params.roleId)
  if (roleId.value) {
    getRoleItem(roleId.value).then(res => {
      roleEditFormConfig.value = defineRoleEditFormConfig(res.data)
    })
  } else {
    roleEditFormConfig.value = defineRoleEditFormConfig(new Role())
  }
})

function defineRoleEditFormConfig(formValue: Role): EditFormConfig {
  const formConfig = new EditFormConfig()
  formConfig.formItems = [
    EditFormItem.defineInputItem('角色名称', 'roleName').setPlaceholder('请输入角色名称')
        .addRule({ required: true, message: '请输入角色名称', trigger: 'blur' }),
    EditFormItem.defineInputItem('角色中文名称', 'roleNameZh').setPlaceholder('请输入角色中文名称'),
    EditFormItem.defineSwitchItem('状态', 'status')
  ]
  formConfig.submitConfig = new SubmitConfig('保存', saveRole)
  formConfig.resettable = true
  formConfig.formValue = formValue
  formConfig.wrapperWidthPercent = 30
  formConfig.openValidate()
  return formConfig;
}

function saveRole(formValue: Role) {
  doSaveRole(formValue).then(() => {
    ElMessage.success('保存成功')
    router.push({name: 'UserRoleManage'})
  }).catch(error => ElMessage.error(error))
}
</script>

<template>
  <SubComponentTitle/>
  <EditForm :editFormConfig="roleEditFormConfig"/>
</template>

<style scoped>

</style>