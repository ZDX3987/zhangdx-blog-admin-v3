<script setup lang="ts">
import {onMounted, onUpdated, ref} from "vue";
import {ContentItem} from "../../type/ContentItem.ts";
import {getContentById, saveOrUpdateContent} from "../../api/content.ts";
import {useRoute} from "vue-router";
import SubComponentTitle from "../../components/common/SubComponentTitle.vue";
import EditForm from "../../components/common/EditForm.vue";
import {EditFormConfig, EditFormItem, SubmitConfig} from "../../type/common/EditFormConfig.ts";
import RichTextEditor from "../../components/editor/RichTextEditor.vue";
import {ElMessage} from "element-plus";
import router from "../../router";

const route = useRoute()
const contentEditFormConfig = ref<EditFormConfig>()
const contentEditorRef = ref<InstanceType<typeof RichTextEditor>>()

onMounted(() => {
  let contentId: number = Number(route.params.contentId)
  if (contentId) {
    getContentById(contentId).then(res => {
      contentEditFormConfig.value = defineContentEditFormConfig(res.data)
      contentEditorRef.value?.setHtml(res.data.html)
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
  formConfig.addAfterSlotTemplate('contentEditor')
  return formConfig;
}

function submitContentForm(formValue: ContentItem) {
  formValue.html = contentEditorRef.value?.getHtml() || ''
  saveOrUpdateContent(formValue).then(() => {
    ElMessage.success('保存成功')
    router.push({name: 'ContentList'})
  }).catch(error => ElMessage.error(error))
}



</script>

<template>
<SubComponentTitle/>
  <EditForm :editFormConfig="contentEditFormConfig">
    <template #contentEditor>
    </template>
  </EditForm>
  <RichTextEditor ref="contentEditorRef"/>
</template>

<style scoped>
</style>