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
import {MenuItemType} from "../../type/MenuItem.ts";

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
      const resultData = res.data;
      permissionEditFormConfig.value = definePermissionEditFormConfig(resultData)
      resourceTypeSelectChange(resultData.resourceType)
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
      permissionEditFormConfig.value.insertFormItem(3, EditFormItem.defineTreeSelectItem(resourceLabel, 'resourceId', await mergeClientAndAdminMenu())
          .setPlaceholder('请选择权限资源').addRule({ required: true, message: '请选择权限资源', trigger: 'blur' }))
      break
    case resourceTypeDefineArray[1].value:
      break
    case resourceTypeDefineArray[2].value:
      break
  }
}

async function mergeClientAndAdminMenu(): Promise<FormOption[]> {
  const clientMenuOptionPromise = await genMenuTreeSelectOptions(MenuItemType.CLIENT)
  const adminMenuOptionPromise = await genMenuTreeSelectOptions(MenuItemType.ADMIN)
  const clientMenuOption = new FormOption('客户端', MenuItemType.CLIENT, MenuItemType.CLIENT)
  clientMenuOption.setChildren(clientMenuOptionPromise)
  const adminMenuOption = new FormOption('管理端', MenuItemType.ADMIN, MenuItemType.ADMIN)
  adminMenuOption.setChildren(adminMenuOptionPromise)
  return [clientMenuOption, adminMenuOption]
}


async function genMenuTreeSelectOptions(menuType: string): Promise<FormOption[]> {
  const res = await getMenuListByType(menuType)
  return res.data.map(item => {
    let formOption = new FormOption(item.text, item.id, item.id)
    let childrenMenu = item.childrenMenu
    if (childrenMenu && childrenMenu.length > 0) {
      formOption.setChildren(childrenMenu.map(subMenu => new FormOption(subMenu.text, subMenu.id, subMenu.id)))
    }
    return formOption
  })
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