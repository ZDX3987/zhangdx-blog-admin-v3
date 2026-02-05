<script setup lang="ts">

import {onMounted, ref} from "vue";
import {CategoryViewConfig} from "../../type/CategoryViewConfig.ts";
import {editCategoryView, getCategoryViewItem} from "../../api/categoryViewApi.ts";
import {CategoryItem} from "../../type/CategoryItem.ts";
import {getAllCategory} from "../../api/categoryApi.ts";
import EditForm from "../../components/common/EditForm.vue";
import {EditFormConfig, EditFormItem, FormOption, SubmitConfig} from "../../type/common/EditFormConfig.ts";
import {useRoute} from "vue-router";
import SubComponentTitle from "../../components/common/SubComponentTitle.vue";
import {ElMessage} from "element-plus";
import router from "../../router";

const route = useRoute()
const categoryViewEditFormConfig = ref<EditFormConfig>(new EditFormConfig())
const viewId = ref<number>()
const categoryList = ref<CategoryItem[]>([])

onMounted(async () => {
  viewId.value = Number(route.params.viewId)
  let options = await searchCategoryList('')
  if (viewId.value) {
    getCategoryViewItem(viewId.value).then((res) => {
      let formValue = res.data;
      formValue.categoryIds = formValue.itemList.map(item => item.categoryId)
      categoryViewEditFormConfig.value = defineViewEditFormConfig(formValue, options)
    })
  } else {
    categoryViewEditFormConfig.value = defineViewEditFormConfig(new CategoryViewConfig(), options)
  }
})

function defineViewEditFormConfig(formValue: CategoryViewConfig, options: FormOption[]): EditFormConfig {
  const formConfig = new EditFormConfig()
  formConfig.formValue = formValue
  formConfig.formItems = [
      EditFormItem.defineInputItem('视图名称', 'name').setPlaceholder('请输入视图名称')
          .addRule({required: true, message: '请输入视图名称', trigger: 'blur'}),
      EditFormItem.defineSelectItem('标签', 'categoryIds', options, undefined, true).setPlaceholder('请选择标签')
          .addRule({required: true, message: '请选择标签', trigger: 'blur'},
              {type: 'array', min: 1, trigger: 'blur'}),
    EditFormItem.defineSwitchItem('是否启用', 'status'),
  ]
  formConfig.submitConfig = new SubmitConfig(submitCategoryView, '保存')
  formConfig.openValidate()
  return formConfig;
}

async function searchCategoryList(queryName: string): Promise<FormOption[]> {
  let response = await getAllCategory(1, 1000, undefined, queryName);
  categoryList.value = response.data.records;
  return categoryList.value.map(item => new FormOption(item.cateName, item.id, item.id))
}

function submitCategoryView(categoryViewForm: CategoryViewConfig) {
  console.log(categoryViewForm)
  editCategoryView(categoryViewForm).then(() => {
    ElMessage.success('保存成功')
    router.push({name: 'CategoryViewManage'})
  }).catch(error => ElMessage.error(error))
}
</script>

<template>
  <SubComponentTitle/>
  <EditForm :editFormConfig="categoryViewEditFormConfig"/>
</template>

<style scoped>

</style>