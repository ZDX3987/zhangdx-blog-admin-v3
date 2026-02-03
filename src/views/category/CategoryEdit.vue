<script setup lang="ts">


import {onMounted, ref} from "vue";
import {CategoryItem} from "../../type/CategoryItem.ts";
import {getCategory, updateCategory} from "../../api/categoryApi.ts";
import {ElMessage} from "element-plus";
import {useRoute, useRouter} from "vue-router";
import SubComponentTitle from "../../components/common/SubComponentTitle.vue";
import EditForm from "../../components/common/EditForm.vue";
import {EditFormConfig, EditFormItem, SubmitConfig} from "../../type/common/EditFormConfig.ts";

const router = useRouter()
const route = useRoute()
const categoryId = ref<number>()
const categoryEditFormConfig = ref<EditFormConfig>(new EditFormConfig())

onMounted(() => {
  categoryId.value = Number(route.params.categoryId)
  if (categoryId.value) {
    getCategory(categoryId.value).then(res => {
      categoryEditFormConfig.value = defineCategoryEditFormConfig(res.data)
    })
  } else {
    categoryEditFormConfig.value = defineCategoryEditFormConfig(new CategoryItem())
  }
})

function defineCategoryEditFormConfig(formValue: CategoryItem): EditFormConfig {
  const formConfig = new EditFormConfig()
  formConfig.submitConfig = new SubmitConfig(doSaveCate, '保存')
  formConfig.resettable = true
  formConfig.formValue = formValue
  formConfig.wrapperWidthPercent = 30
  formConfig.formItems = [
    EditFormItem.defineInputItem('标签名称', 'cateName').setPlaceholder('请输入标签名称')
        .addRule({ required: true, message: '请输入标签名称', trigger: 'blur' }),
    EditFormItem.defineInputItem('父标签', 'roleNameZh').setPlaceholder('请输入父标签'),
    EditFormItem.defineSwitchItem('状态', 'status'),

  ]
  return formConfig
}

function doSaveCate(category: CategoryItem) {
  updateCategory(category).then(() => {
    ElMessage.success('保存成功')
    router.push({'name': 'CategoryManage'})
  }).catch(error => ElMessage.error(error.msg))
}
</script>

<template>
  <SubComponentTitle/>
  <EditForm :editFormConfig="categoryEditFormConfig"/>
</template>

<style scoped>
</style>