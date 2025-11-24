<script setup lang="ts">

import {computed, onMounted, ref} from "vue";
import {CategoryViewConfig} from "../../type/CategoryViewConfig.ts";
import {type CascaderProps, ElMessage, type FormInstance, type Resolve} from "element-plus";
import {editCategoryView} from "../../api/categoryViewApi.ts";
import {CategoryItem} from "../../type/CategoryItem.ts";
import {getAllCategory} from "../../api/categoryApi.ts";
import {ResultPage} from "../../type/ResultPage.ts";
import router from "../../router";

const categoryViewConfigForm = ref<CategoryViewConfig>(new CategoryViewConfig())
const categoryViewFormRef = ref<FormInstance>()
const categoryViewRules = {
  name: [
    {required: true, message: '请输入名称', trigger: 'blur'}
  ]
}

const categorySelectProps: CascaderProps = {
  lazy: true,
  multiple: true,
  lazyLoad(node, resolve) {
    resolveCategoryList(resolve)
  }
}

onMounted(() => {
})

function submitCategoryView(formRef: FormInstance | undefined) {
  if (!formRef) {
    return
  }
  formRef.validate(valid => {
    if (valid) {
      let categoryViewConfig = categoryViewConfigForm.value
      categoryViewConfig.status = categoryViewConfig.status ? 1 : 0
      categoryViewConfig.categoryIds = [...new Set(categoryViewConfig.categoryIds.flatMap(e => e))]
      editCategoryView(categoryViewConfig).then(() => {
        ElMessage.success('保存成功')
        router.push({name:'CategoryViewList'})
      })
          .catch(error => ElMessage.error(error));
    }
  })
}

function resetForm() {
  categoryViewConfigForm.value = new CategoryViewConfig()
}

async function resolveCategoryList(resolve: Resolve) {
  let apiResponse = await getAllCategory(1000, 1)
  let records = ResultPage.build<CategoryItem>(apiResponse.data, CategoryItem).records
  let firstLevelCate = records.filter(e => e.parentCate === null)
  firstLevelCate.forEach(cate => cate.children = records.filter(e => e.parentCate !== null && e.parentCate.id === cate.id))
  let nodes = firstLevelCate.map(cate => constructOption(cate))
  resolve(nodes)
}

function constructOption(cate: CategoryItem): any {
  return {
    value: cate.id,
    label: cate.cateName,
    children: cate.children ? cate.children.map(e => constructOption(e)) : null,
    leaf: !(cate.children && cate.children.length > 0)
  }
}
</script>

<template>
  <div class="category_view_edit_content">
    <el-form class="category_view_edit_form" :model="categoryViewConfigForm" label-width="auto" :rules="categoryViewRules" ref="categoryViewFormRef">
      <el-form-item label="视图名称" prop="name">
        <el-input v-model="categoryViewConfigForm.name"></el-input>
      </el-form-item>
      <el-form-item label="标签">
        <el-cascader v-model="categoryViewConfigForm.categoryIds" :props="categorySelectProps"/>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="categoryViewConfigForm.status"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitCategoryView(categoryViewFormRef)">提交</el-button>
        <el-button @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.category_view_edit_form {
  width: 50%;
}
</style>