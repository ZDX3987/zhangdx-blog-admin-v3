<script setup lang="ts">

import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {UpdateLog} from "../../type/UpdateLog.ts";
import {updateLogStatus} from "../../type/common/commonStatusConst.ts";
import "vditor/dist/index.css";
import {getUpdateLogById, saveUpdateLog} from "../../api/updateLogApi.ts";
import {ElMessage, type FormInstance} from "element-plus";
import MarkdownContent from "../../components/editor/MarkdownContent.vue";
import {EditFormConfig, EditFormItem, FormOption, SubmitConfig} from "../../type/common/EditFormConfig.ts";
import SubComponentTitle from "../../components/common/SubComponentTitle.vue";
import EditForm from "../../components/common/EditForm.vue";

const route = useRoute()
const router = useRouter()
const updateLogForm = ref<UpdateLog>(new UpdateLog())
const markdownContentRef = ref<InstanceType<typeof MarkdownContent>>()
const updateLogEditFormConfig = ref<EditFormConfig>()

onMounted(() => {
  const logId = Number(route.params.logId)
  if (logId) {
    getUpdateLogById(logId).then(res => {
      updateLogForm.value = res.data
      updateLogEditFormConfig.value = defineUpdateLogEditFormConfig(updateLogForm.value)
    })
  } else {
    updateLogEditFormConfig.value = defineUpdateLogEditFormConfig(new UpdateLog())
  }
})

function defineUpdateLogEditFormConfig(formValue: UpdateLog): EditFormConfig {
  const formConfig: EditFormConfig = new EditFormConfig()
  formConfig.formValue = formValue
  formConfig.submitConfig = new SubmitConfig(doSave, '保存')
  formConfig.formItems = [
      EditFormItem.defineInputItem('标题', 'title').setPlaceholder('请输入标题')
          .addRule({trigger: "blur", required: true, message: '请输入标题'}),
    EditFormItem.defineSelectItem('状态', 'status', genUpdateLogStatusOption()).setPlaceholder('请选择状态')
        .addRule({trigger: "change", required: true, message: '请选择状态'})
  ]
  formConfig.resettable = true
  formConfig.openValidate()
  formConfig.wrapperWidthPercent = 30
  return formConfig
}

function genUpdateLogStatusOption(): FormOption[] {
  return updateLogStatus.map(status => new FormOption(status.name, status.value, status.value))
}

function doSave(formValue: UpdateLog) {
  formValue.content = markdownContentRef.value?.getEditorValue()
  saveUpdateLog(formValue).then(() => {
    ElMessage.success('保存成功')
    router.push({ name: 'UpdateLogList' })
  }).catch(() => ElMessage.error('保存失败'))
}

</script>

<template>
<div class="update_log_edit_content">
  <SubComponentTitle/>
  <EditForm :editFormConfig="updateLogEditFormConfig"></EditForm>
  <MarkdownContent :markdownText="updateLogForm.content" :contentKey="updateLogForm.id" ref="markdownContentRef"/>

</div>
</template>

<style scoped>
</style>