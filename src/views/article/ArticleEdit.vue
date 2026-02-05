<script setup lang="ts">

import EditForm from "../../components/common/EditForm.vue";
import {onMounted, ref} from "vue";
import {EditFormConfig, EditFormItem, SubmitConfig} from "../../type/common/EditFormConfig.ts";
import {useRoute} from "vue-router";
import {getArticleById} from "../../api/articelApi.ts";
import {ArticleItem} from "../../type/ArticleItem.ts";
import CategorySelectDialog from "../../components/dialog/CategorySelectDialog.vue";

const route = useRoute()
const articleEditFormConfig = ref<EditFormConfig>()
const articleId = ref<number>()
const articleInfo = ref<ArticleItem>(new ArticleItem())
const categorySelectDialogRef = ref<InstanceType<typeof CategorySelectDialog>>()

onMounted(() => {
  articleId.value = Number(route.params.articleId)
  if (articleId.value) {
    getArticleById(articleId.value).then(res => {
      articleInfo.value = res.data
      articleEditFormConfig.value = defineArticleEditConfig(res.data)
    })
  } else {
    articleEditFormConfig.value = defineArticleEditConfig(new ArticleItem())
  }
})

function defineArticleEditConfig(formValue: ArticleItem): EditFormConfig {
  const formConfig: EditFormConfig = new EditFormConfig()
  formConfig.formValue = formValue
  formConfig.formItems = [
      EditFormItem.defineInputItem('文章标题', 'title').setPlaceholder('请输入文章标题')
          .addRule({required: true, message: '请输入文章标题', trigger: 'blur'}),
      EditFormItem.defineUploadItem('文章封面', 'coverImg'),
    EditFormItem.defineSlotItem('文章标签', 'articleCategory')
  ]
  formConfig.submitConfig = new SubmitConfig(() => {}, '保存')
  formConfig.openValidate()
  return formConfig;
}

function showCategoryDialog() {
  categorySelectDialogRef.value?.showDialog()
}
</script>

<template>
<div>
  <EditForm :editFormConfig="articleEditFormConfig">
    <template #articleCategory>
      <el-tag v-for="cate in articleInfo.categories" :key="cate.id" closable>
        {{ cate.cateName }}
      </el-tag>
      <el-button type="primary" @click="showCategoryDialog">添加标签</el-button>
    </template>
  </EditForm>
</div>
  <CategorySelectDialog ref="categorySelectDialogRef"/>
</template>

<style scoped>

</style>