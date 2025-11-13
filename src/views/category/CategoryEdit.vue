<script setup lang="ts">


import {ref} from "vue";
import {CategoryItem} from "../../type/CategoryItem.ts";
import {updateCategory} from "../../api/categoryApi.ts";
import {ElMessage, type FormInstance} from "element-plus";
import {useRoute, useRouter} from "vue-router";

const router = useRouter()
const route = useRoute()
const cateFormRef = ref<FormInstance>()
const cateForm = ref<CategoryItem>(new CategoryItem())
const cateRules = {
  cateName: [
    {required: true, message: '请输入标签名称', trigger: 'blur'}
  ]
}

function selectParentCate() {

}

function submitCate(cateFormRef: FormInstance | undefined) {
  if (!cateFormRef) {
    return
  }
  cateFormRef.validate(valid => {
    if (valid) {
      let categoryItem = cateForm.value
      categoryItem.status = categoryItem.status ? 1 : 0
      doSaveCate(categoryItem)
    }
  })
}
function resetForm() {
  cateForm.value = new CategoryItem()
}

function doSaveCate(category: CategoryItem) {
  updateCategory(category).then(() => {
    ElMessage.success('保存成功')
    router.push({'name': 'CategoryManage'})
  }).catch(error => ElMessage.error(error.msg))
}
</script>

<template>
<div class="category_edit_content">
  <el-form class="category_edit_form" :model="cateForm" label-width="auto" :rules="cateRules" ref="cateFormRef">
    <el-form-item label="标签名称" prop="cateName">
      <el-input v-model="cateForm.cateName"></el-input>
    </el-form-item>
    <el-form-item label="父标签">
      <el-input :value="cateForm.parentCate ? cateForm.parentCate.cateName : ''" readonly
                v-on:dblclick.native="selectParentCate"></el-input>
    </el-form-item>
    <el-form-item label="状态">
      <el-switch v-model="cateForm.status"></el-switch>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitCate(cateFormRef)">提交</el-button>
      <el-button @click="resetForm()">重置</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<style scoped>
.category_edit_form {
  width: 30%;
}
</style>