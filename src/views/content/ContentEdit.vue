<script setup lang="ts">
import {onMounted, ref} from "vue";
import {ContentItem} from "../../type/ContentItem.ts";
import {getContentById} from "../../api/content.ts";
import {useRoute} from "vue-router";
import SubComponentTitle from "../../components/common/SubComponentTitle.vue";
import EditForm from "../../components/common/EditForm.vue";
import {EditFormConfig, EditFormItem, SubmitConfig} from "../../type/common/EditFormConfig.ts";
import '@wangeditor/editor/dist/css/style.css'
import RichTextEditor from "../../components/editor/RichTextEditor.vue";

const route = useRoute()
const contentEditFormConfig = ref<EditFormConfig>()

onMounted(() => {
  let contentId: number = Number(route.params.contentId)
  if (contentId) {
    getContentById(contentId).then(res => {
      contentEditFormConfig.value = defineContentEditFormConfig(res.data)
      editorValue.value = res.data.html
    })
  } else {
    contentEditFormConfig.value = defineContentEditFormConfig(new ContentItem())
  }
})

function defineContentEditFormConfig(formValue: ContentItem): EditFormConfig {
  const formConfig = new EditFormConfig()
  formConfig.formValue = formValue
  formConfig.submitConfig = new SubmitConfig(submitContentForm, '保存')
  formConfig.formItems = [
      EditFormItem.defineInputItem('名称', 'name').setPlaceholder('请输入名称')
          .addRule({required: true, message: '请输入名称', trigger: 'blur'}),
      EditFormItem.defineInputItem('文档ID', 'documentId').setPlaceholder('请输入文档ID')
          .addRule({required: true, message: '请输入文档ID', trigger: 'blur'}),
      EditFormItem.defineInputItem('路由', 'router').setPlaceholder('请输入路由')
          .addRule({required: true, message: '请输入路由', trigger: 'blur'}),
  ]
  formConfig.openValidate()
  formConfig.wrapperWidthPercent = 30
  formConfig.addAfterSlotTemplate('status')
  return formConfig;
}

function submitContentForm(formValue: ContentItem) {

}



</script>

<template>
<SubComponentTitle/>
  <EditForm :editFormConfig="contentEditFormConfig"></EditForm>
  <RichTextEditor/>
</template>

<style scoped>
</style>