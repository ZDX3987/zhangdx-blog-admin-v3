<script setup lang="ts">

import SubComponentTitle from "../../components/common/SubComponentTitle.vue";
import EditForm from "../../components/common/EditForm.vue";
import {onMounted, ref} from "vue";
import {EditFormConfig, EditFormItem, FormOption, SubmitConfig} from "../../type/common/EditFormConfig.ts";
import {useRoute, useRouter} from "vue-router";
import {Role} from "../../type/Role.ts";
import {doSaveRole, getRoleItem} from "../../api/roleApi.ts";
import {ElMessage} from "element-plus";
import type {Permission} from "../../type/Permission.ts";
import {getPermissionPages} from "../../api/permissionApi.ts";

const roleEditFormConfig = ref<EditFormConfig>(new EditFormConfig())
const route = useRoute()
const router = useRouter()
const roleId = ref<number>()

onMounted(() => {
  roleId.value = Number(route.params.roleId)
  getPermissionPages(1, 100).then(permissionRes => {
    const allPermission = permissionRes.data.records;
    if (roleId.value) {
      getRoleItem(roleId.value).then(res => {
        roleEditFormConfig.value = defineRoleEditFormConfig(res.data, allPermission)
      })
    } else {
      roleEditFormConfig.value = defineRoleEditFormConfig(new Role(), allPermission)
    }
  })

})

function defineRoleEditFormConfig(formValue: Role, allPermission: Permission[]): EditFormConfig {
  const formConfig = new EditFormConfig()
  formConfig.formItems = [
    EditFormItem.defineInputItem('角色名称', 'roleName').setPlaceholder('请输入角色名称')
        .addRule({ required: true, message: '请输入角色名称', trigger: 'blur' }),
    EditFormItem.defineInputItem('角色中文名称', 'roleNameZh').setPlaceholder('请输入角色中文名称'),
    EditFormItem.defineSwitchItem('状态', 'status'),
    EditFormItem.defineTransferItem('角色权限', formatPermissionTransferData(allPermission), 'permissionIdList', ['未选', '已选'])
        .addRule({ required: true, message: '请选择角色权限', trigger: 'blur' },{ type: 'array', min: 1, message: '最少需要一个权限', trigger: 'blur' })
  ]
  formConfig.submitConfig = new SubmitConfig(saveRole, '保存')
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

function formatPermissionTransferData(permissionList: Permission[]): FormOption[] {
  if (permissionList) {
    return permissionList.map(e => new FormOption(e.name, e.id, e.id))
  }
  return []
}
</script>

<template>
  <SubComponentTitle/>
  <EditForm :editFormConfig="roleEditFormConfig"/>
</template>

<style scoped>

</style>