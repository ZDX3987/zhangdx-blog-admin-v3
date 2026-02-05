<script setup lang="ts">

import EditForm from "../../components/common/EditForm.vue";
import {onMounted, ref} from "vue";
import {EditFormConfig, EditFormItem, SubmitConfig} from "../../type/common/EditFormConfig.ts";
import {useRoute} from "vue-router";
import {getArticleById} from "../../api/articelApi.ts";
import {ArticleItem} from "../../type/ArticleItem.ts";
import CategorySelectDialog from "../../components/dialog/CategorySelectDialog.vue";
import type {CategoryItem} from "../../type/CategoryItem.ts";
import VditorContent from "../../components/editor/VditorContent.vue";

const route = useRoute()
const articleEditFormConfig = ref<EditFormConfig>()
const articleId = ref<number>()
const articleInfo = ref<ArticleItem>(new ArticleItem())
const categorySelectDialogRef = ref<InstanceType<typeof CategorySelectDialog>>()
const coverImgFileList = ref<File[]>([])

onMounted(() => {
  articleId.value = Number(route.params.articleId)
  if (articleId.value) {
    getArticleById(articleId.value).then(res => {
      articleInfo.value = res.data
      articleEditFormConfig.value = defineArticleEditConfig(articleInfo.value)
    })
  } else {
    articleEditFormConfig.value = defineArticleEditConfig(articleInfo.value)
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

function selectSingleCategory(selectCategory: CategoryItem) {
  let categories = new Set(articleInfo.value.categories || [])
  categories.add(selectCategory)
  articleInfo.value.categories = [...categories]
}

function removeSelectCategory(removeCategory: CategoryItem) {
  let categories = articleInfo.value.categories || []
  articleInfo.value.categories = categories.filter(item => item.id !== removeCategory.id)
}

function saveDraftArticle(callback: Function) {
  let articleForm = articleInfo.value
  articleForm.coverImg = coverImgFileList.value[0] ? coverImgFileList.value[0].name : ''

}
</script>

<template>
<div>
  <EditForm :editFormConfig="articleEditFormConfig">
    <template #articleCategory>
      <el-tag class="article-cate-list" v-for="cate in articleInfo.categories" :key="cate.id" closable
       @close="removeSelectCategory(cate)">
        {{ cate.cateName }}
      </el-tag>
      <el-button type="primary" size="small" @click="showCategoryDialog">添加标签</el-button>
    </template>
  </EditForm>
  <el-tabs type="border-card">
    <el-tab-pane label="Markdown编辑器">
      <VditorContent/>
    </el-tab-pane>
    <el-tab-pane label="富文本编辑器"></el-tab-pane>
  </el-tabs>
</div>
  <CategorySelectDialog ref="categorySelectDialogRef" @selectSingleCategory="selectSingleCategory"/>
</template>

<style scoped>
.article-cate-list {
  margin-right: 10px;
}
</style>