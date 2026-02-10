<script setup lang="ts">
import {ref} from "vue";
import {saveMenu} from "../../api/menuApi.ts";
import {MenuItem} from "../../type/MenuItem.ts";
import {EditFormConfig, EditFormItem, SubmitConfig} from "../../type/common/EditFormConfig.ts";
import EditForm from "../common/EditForm.vue";
import {ElMessage} from "element-plus";

const menuEditFormConfig = ref<EditFormConfig>(new EditFormConfig())
const dialogTableVisible = ref<boolean>(false)
const editParentMenu = ref<MenuItem>(new MenuItem())
const emit = defineEmits(['submitEditMenu'])

defineExpose({
  showDialog,
  closeDialog
})

function defineMenuEditFormConfig(formValue: MenuItem) {
  const formConfig = new EditFormConfig()
  formConfig.formValue = formValue
  formConfig.wrapperWidthPercent = 100
  formConfig.formItems = [
    EditFormItem.defineInputItem('名称', 'name').setPlaceholder('请输入菜单名称')
        .addRule({required: true, message: '请输入菜单名称', trigger: 'blur'}),
    EditFormItem.defineInputItem('文本', 'text').setPlaceholder('请输入菜单展示文本')
        .addRule({required: true, message: '请输入菜单展示文本', trigger: 'blur'}),
    EditFormItem.defineInputItem('路由', 'router').setPlaceholder('请输入菜单路由'),
    EditFormItem.defineInputItem('组件名', 'componentName').setPlaceholder('请输入组件名'),
    EditFormItem.defineSlotItem('父菜单', 'parentMenuInput'),
    EditFormItem.defineInputItem('图标', 'iconClass').setPlaceholder('请输入菜单图标类名'),
    EditFormItem.defineSwitchItem('启用', 'status')
  ]
  formConfig.submitConfig = new SubmitConfig(submitEditForm, '保存')
  formConfig.openValidate()
  return formConfig
}

function submitEditForm(formValue: MenuItem) {
  emit('submitEditMenu', formValue)
  closeDialog()
}

function showDialog(menuEditItem: MenuItem, parentMenu?: MenuItem) {
  menuEditItem.parentMenu = parentMenu
  menuEditFormConfig.value = defineMenuEditFormConfig(menuEditItem)
  if (parentMenu) {
    editParentMenu.value = parentMenu
  }
  dialogTableVisible.value = true
}
function closeDialog() {
  dialogTableVisible.value = false
}
</script>

<template>
<el-dialog v-model="dialogTableVisible" title="请编辑菜单" width="600" @close="closeDialog">
  <EditForm :editFormConfig="menuEditFormConfig">
    <template #parentMenuInput>
      <el-input v-model="editParentMenu.text" disabled/>
    </template>
  </EditForm>
</el-dialog>
</template>

<style scoped>

</style>