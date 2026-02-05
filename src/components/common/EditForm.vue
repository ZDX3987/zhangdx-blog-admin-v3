<script setup lang="ts">

import {EditFormConfig, FormItemType} from "../../type/common/EditFormConfig.ts";
import {ref, watch} from "vue";
import type {FormInstance} from "element-plus";

const props = defineProps({
  editFormConfig: {
    type: EditFormConfig
  },
})

watch(props, (newVal) => {
  if (newVal) {
    realFormValue.value = newVal.editFormConfig?.formValue
  }
})

const formRef = ref<FormInstance>()
const realFormValue = ref<any>({})

function submitForm() {
  let submitConfig = props.editFormConfig?.submitConfig;
  let validatable = props.editFormConfig?.validatable
  let submitFunc = submitConfig?.submitFunc
  if (validatable) {
    formRef.value?.validate(valid => {
      if (valid && submitFunc) {
        submitFunc(realFormValue.value)
      }
    })
  }
}

function resetForm() {
  let cls = realFormValue.value.constructor
  realFormValue.value = new cls()
}
</script>

<template>
<div class="edit_form_wrapper" :style="{width: editFormConfig?.wrapperWidthPercent + '%'}">
  <el-form :model="realFormValue" label-width="auto" ref="formRef" :rules="editFormConfig?.rules" :inline="editFormConfig?.inline">
    <el-form-item v-for="formItem in editFormConfig?.formItems" :key="formItem" :label="formItem.label" :prop="formItem.model">
      <el-input v-if="formItem.type === FormItemType.Input" v-model="realFormValue[formItem.model]" :placeholder="formItem.placeholder">
      </el-input>
      <el-select v-else-if="formItem.isSelect()" v-model="realFormValue[formItem.model]" :placeholder="formItem.placeholder"
        :remote="formItem.isRemoteMode" :filterable="formItem.isRemoteMode" :remote-method="(queryName: string) => formItem.selectRemoteSearch(queryName)">
        <el-option v-for="option in formItem.options" :key="option.value" :label="option.label" :value="option.value">
        </el-option>
      </el-select>
      <el-switch v-else-if="formItem.isSwitch()" v-model="realFormValue[formItem.model]"
                 :inactive-value="formItem.switchValue[0]" :active-value="formItem.switchValue[1]">
      </el-switch>
      <el-transfer v-else-if="formItem.isTransfer()" :data="formItem.data" v-model="realFormValue[formItem.model]"
        :titles="formItem.title" :button-texts="formItem.buttonText">
      </el-transfer>
    </el-form-item>
    <el-form-item>
      <el-button v-if="editFormConfig?.submitConfig" :type="editFormConfig?.submitConfig.type" @click="submitForm">
        {{editFormConfig?.submitConfig.btnText}}</el-button>
      <el-button v-if="editFormConfig?.resettable" @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<style scoped>

</style>