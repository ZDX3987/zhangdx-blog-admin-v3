<script setup lang="ts">

import {useRoute, useRouter} from "vue-router";
import {onMounted, reactive, ref} from "vue";
import {UpdateLog} from "../../type/UpdateLog.ts";
import {updateLogStatus} from "../../type/common/commonStatusConst.ts";
import Vditor from 'vditor';
import "vditor/dist/index.css";
import {getUpdateLogById, saveUpdateLog} from "../../api/updateLogApi.ts";
import {ElMessage, type FormInstance, type FormRules} from "element-plus";

const route = useRoute()
const router = useRouter()
const updateLogForm = ref<UpdateLog>(new UpdateLog())
const updateLogEditor = ref<Vditor>()
const updateLogFormRef = ref<FormInstance>()
const updateLogFormRule = {
  title: [{trigger: "blur", required: true, message: '请输入标题'}],
  status: [{trigger: "change", required: true, message: '请选择状态'}],
}

onMounted(() => {
  initEditor()
  queryUpdateLog(Number(route.params.logId))
})

function queryUpdateLog(logId: number) {
  getUpdateLogById(logId).then(res => {
    updateLogForm.value = res.data
    updateLogEditor.value.setValue(updateLogForm.value.content)
  })
}

function initEditor() {
  updateLogEditor.value = new Vditor('updateLogEditor', {
    minHeight: 600,
    placeholder: '请在此处输入内容...',
    counter: {enable: true, type: "text"},
    cache: {
      enable: false,
    },
    mode: 'sv'
  })
}

function doSave(formEl: FormInstance | undefined) {
  if (!formEl) {
    return
  }
  formEl.validate((valid) => {
    if (!valid) {
      return
    }
    updateLogForm.value.content = updateLogEditor.value?.getValue()
    saveUpdateLog(updateLogForm.value).then(() => {
      ElMessage.success('保存成功')
      router.push({ name: 'UpdateLogList' })
    }).catch(() => ElMessage.error('保存失败'))
  })
}

function resetForm(formEl: FormInstance | undefined) {
  formEl?.resetFields()
  updateLogEditor.value.deleteValue()

}

function goBack() {
  router.push({name: 'UpdateLogList'})
}

</script>

<template>
<div class="update_log_edit_content">
  <el-page-header @back="goBack">
    <template #content>
      <span class="page_header_title">{{route.meta.title}}</span>
    </template>
  </el-page-header>
  <div class="update_log_edit_form">
    <el-form :model="updateLogForm" ref="updateLogFormRef" :rules="updateLogFormRule" label-width="auto" style="max-width: 600px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="updateLogForm.title"/>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="updateLogForm.status">
          <el-option v-for="item in updateLogStatus" :key="item.value" :label="item.name" :value="item.value"/>
        </el-select>
      </el-form-item>
    </el-form>
    <el-row>
      <el-col :span="12">
        <div id="updateLogEditor"></div>
      </el-col>
    </el-row>
    <div class="update_log_edit_btn">
      <el-button type="primary" @click="doSave(updateLogFormRef)">保存</el-button>
      <el-button @click="resetForm(updateLogFormRef)">重置</el-button>
    </div>
  </div>
</div>
</template>

<style scoped>
.page_header_title {
  font-weight: 500;
}
.update_log_edit_form {
  margin: 20px 0;
}
.update_log_edit_btn {
  margin-top: 20px;
}
</style>