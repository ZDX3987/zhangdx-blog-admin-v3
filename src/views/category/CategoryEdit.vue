<script setup lang="ts">


import {onMounted, ref} from "vue";
import {CategoryItem} from "../../type/CategoryItem.ts";
import {getAllCategory, getCategory, updateCategory} from "../../api/categoryApi.ts";
import {ElMessage} from "element-plus";
import {useRoute, useRouter} from "vue-router";
import SubComponentTitle from "../../components/common/SubComponentTitle.vue";
import EditForm from "../../components/common/EditForm.vue";
import {EditFormConfig, EditFormItem, FormOption, SubmitConfig} from "../../type/common/EditFormConfig.ts";

const router = useRouter()
const route = useRoute()
const categoryId = ref<number>()
const categoryEditFormConfig = ref<EditFormConfig>(new EditFormConfig())
const parentCategoryList = ref<CategoryItem[]>()

onMounted(async () => {
  categoryId.value = Number(route.params.categoryId)
  let parentCateOptions = await searchParentCategory('')
  if (categoryId.value) {
    getCategory(categoryId.value).then(res => {
      categoryEditFormConfig.value = defineCategoryEditFormConfig(res.data, parentCateOptions)
    })
  } else {
    categoryEditFormConfig.value = defineCategoryEditFormConfig(new CategoryItem(), parentCateOptions)
  }
})

function defineCategoryEditFormConfig(formValue: CategoryItem, parentCateOptions: FormOption[]): EditFormConfig {
  const formConfig = new EditFormConfig()
  formConfig.submitConfig = new SubmitConfig(doSaveCate, '保存')
  formConfig.resettable = true
  formConfig.formValue = formValue
  formConfig.wrapperWidthPercent = 30
  formConfig.formItems = [
    EditFormItem.defineInputItem('标签名称', 'cateName').setPlaceholder('请输入标签名称')
        .addRule({ required: true, message: '请输入标签名称', trigger: 'blur' }),
    EditFormItem.defineSelectItem('父标签', 'parentId', parentCateOptions)
        .setPlaceholder('请选择父标签'),
    EditFormItem.defineSwitchItem('状态', 'status')
  ]
  formConfig.openValidate()
  return formConfig
}

function doSaveCate(category: CategoryItem) {
  let parentId = category.parentId
  category.parentCate = parentCategoryList.value?.find(e => e.id === parentId)
  updateCategory(category).then(() => {
    ElMessage.success('保存成功')
    router.push({'name': 'CategoryManage'})
  }).catch(error => ElMessage.error(error.msg))
}

async function searchParentCategory(queryName: string): Promise<FormOption[]> {
  let response = await getAllCategory(1, 1000, 1, queryName);
  parentCategoryList.value = response.data.records;
  return parentCategoryList.value.map(item => new FormOption(item.cateName, item.id, item.id))
}
</script>

<template>
  <SubComponentTitle/>
  <EditForm :editFormConfig="categoryEditFormConfig"/>
</template>

<style scoped>
</style>