<script setup lang="ts">
import {onMounted, ref} from "vue";
import {saveMenu} from "../../api/menuApi.ts";
import {MenuItem} from "../../type/MenuItem.ts";
import {EditFormConfig, EditFormItem, SubmitConfig} from "../../type/common/EditFormConfig.ts";
import EditForm from "../common/EditForm.vue";

const menuEditFormConfig = ref<EditFormConfig>()
const dialogTableVisible = ref<boolean>(false)
const props = defineProps({
  menuItem: {
    type: MenuItem,
    default: () => {new MenuItem()}
  }
})

onMounted(() => {
  menuEditFormConfig.value = defineMenuEditFormConfig(props.menuItem)
})

function defineMenuEditFormConfig(formValue: MenuItem) {
  const formConfig = new EditFormConfig()
  formConfig.formValue = formValue
  formConfig.wrapperWidthPercent = 30
  formConfig.formItems = [
    EditFormItem.defineInputItem('名称', 'name').setPlaceholder('请输入菜单名称')
        .addRule({required: true, message: '请输入菜单名称', trigger: 'blur'}),
    EditFormItem.defineInputItem('文本', 'text').setPlaceholder('请输入菜单展示文本')
        .addRule({required: true, message: '请输入菜单展示文本', trigger: 'blur'}),
    EditFormItem.defineInputItem('路由', 'router').setPlaceholder('请输入菜单路由')
        .addRule({required: true, message: '请输入菜单路由', trigger: 'blur'}),
    EditFormItem.defineInputItem('组件', 'componentName').setPlaceholder('请输入组件名')
        .addRule({required: true, message: '请输入组件名', trigger: 'blur'}),
    EditFormItem.defineInputItem('父菜单', 'parentMenu.text').setPlaceholder('请选择父菜单')
        .addRule({required: true, message: '请选择父菜单', trigger: 'blur'}),
    EditFormItem.defineInputItem('图标', 'iconClass').setPlaceholder('请输入菜单图标类名'),
    EditFormItem.defineSwitchItem('启用', 'status')
  ]
  formConfig.submitConfig = new SubmitConfig(saveMenu, '保存')
  formConfig.openValidate()
  return formConfig;
}
</script>

<template>
<el-dialog v-model="dialogTableVisible" title="请编辑菜单" width="600" @close="">
  <EditForm :editFormConfig="menuEditFormConfig"/>
</el-dialog>
</template>

<style scoped>

</style>