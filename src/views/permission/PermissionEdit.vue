<script setup lang="ts">

import EditForm from "../../components/common/EditForm.vue";
import {onMounted, ref} from "vue";
import {EditFormConfig, EditFormItem, FormOption, SubmitConfig} from "../../type/common/EditFormConfig.ts";
import {PermissionForm} from "../../type/PermissionForm.ts";
import {doSavePermission, getPermission} from "../../api/permissionApi.ts";
import {useRoute, useRouter} from "vue-router";
import {ElMessage} from "element-plus";
import SubComponentTitle from "../../components/common/SubComponentTitle.vue";
import {getMenuListByType} from "../../api/menuApi.ts";

const permissionEditFormConfig = ref<EditFormConfig>(new EditFormConfig())
const route = useRoute()
const router = useRouter()
const permissionId = ref<number>()
const resourceTypeDefineArray: FormOption[] = [
  new FormOption('菜单', 1, 1),
  new FormOption('按钮', 2, 2),
  new FormOption('路由', 3, 3),
]

onMounted(() => {
  permissionId.value = Number(route.params.permissionId)
  if (permissionId.value) {
    getPermission(permissionId.value).then(res => {
      permissionEditFormConfig.value = definePermissionEditFormConfig(res.data)
    })
  } else {
    permissionEditFormConfig.value = definePermissionEditFormConfig(new PermissionForm())
  }
})

function definePermissionEditFormConfig(formValue: PermissionForm): EditFormConfig {
  const formConfig = new EditFormConfig()
  formConfig.formItems = [
    EditFormItem.defineInputItem('权限代码', 'permissionCode').setPlaceholder('请输入权限代码')
        .addRule({ required: true, message: '请输入权限代码', trigger: 'blur' }),
    EditFormItem.defineInputItem('权限名称', 'name').setPlaceholder('请输入权限名称')
        .addRule({ required: true, message: '请输入名称', trigger: 'blur' }),
    EditFormItem.defineSelectItem('资源类型', 'resourceType', resourceTypeDefineArray).addChangeFunction(resourceTypeSelectChange).setPlaceholder('请选择权限资源类型')
        .addRule({ required: true, message: '请选择资源类型', trigger: 'blur' }),
    EditFormItem.defineSwitchItem('状态', 'status')
  ]
  formConfig.submitConfig = new SubmitConfig(savePermission, '保存')
  formConfig.resettable = true
  formConfig.formValue = formValue
  formConfig.wrapperWidthPercent = 30
  formConfig.openValidate()
  return formConfig
}

function savePermission(formValue: PermissionForm) {
  doSavePermission(formValue).then(() => {
    ElMessage.success('保存成功')
    router.push({name: 'PermissionManage'})
  }).catch(error => ElMessage.error(error))
}

async function resourceTypeSelectChange(value: any) {
  const resourceLabel = '权限资源'
  permissionEditFormConfig.value.removeFormItem(resourceLabel)
  switch (value) {
    case resourceTypeDefineArray[0].value:
      permissionEditFormConfig.value.insertFormItem(3, EditFormItem.defineTreeSelectItem(resourceLabel, 'resourceId', await genMenuTreeSelectOptions())
          .setPlaceholder('请选择权限资源').addRule({ required: true, message: '请选择权限资源', trigger: 'blur' }))
      break
    case resourceTypeDefineArray[1].value:
      break
    case resourceTypeDefineArray[2].value:
      break
  }
}

async function genMenuTreeSelectOptions(): Promise<FormOption[]> {
  const res = await getMenuListByType('CLIENT')
  return res.data.map(item => new FormOption(item.text, item.id, item.id))
}
</script>

<template>
<div class="permission_edit_content">
  <SubComponentTitle/>
  <EditForm :editFormConfig="permissionEditFormConfig"></EditForm>
</div>
</template>

<style scoped>

</style>