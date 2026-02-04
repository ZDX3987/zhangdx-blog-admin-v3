<script setup lang="ts">

import SubComponentTitle from "../../components/common/SubComponentTitle.vue";
import EditForm from "../../components/common/EditForm.vue";
import {onMounted, ref} from "vue";
import {EditFormConfig, EditFormItem, SubmitConfig} from "../../type/common/EditFormConfig.ts";
import {TopicItem} from "../../type/TopicItem.ts";
import SelectArticleTable from "../../components/article/SelectArticleTable.vue";
import ArticleSelectDialog from "../../components/dialog/ArticleSelectDialog.vue";
import type {ArticleItem} from "../../type/ArticleItem.ts";

const topicEditFormConfig = ref<EditFormConfig>(new EditFormConfig())
const dialogTableVisible = ref<boolean>(false)
const selectArticleList = ref<ArticleItem[]>([])

onMounted(() => {
  topicEditFormConfig.value = defineTopicEditFormConfig(new TopicItem())
})

function defineTopicEditFormConfig(formValue: TopicItem): EditFormConfig {
  const formConfig = new EditFormConfig()
  formConfig.formValue = formValue
  formConfig.formItems = [
    EditFormItem.defineInputItem('专栏名称', 'title').setPlaceholder('请输入专栏名称')
        .addRule({ required: true, message: '请输入专栏名称', trigger: 'blur' }),
  ]
  formConfig.wrapperWidthPercent = 50
  formConfig.openValidate()
  formConfig.resettable = false
  formConfig.submitConfig = new SubmitConfig(saveTopic, '保存')
  return formConfig
}

function saveTopic() {
  console.log(selectArticleList.value)
}

function showDialog() {
  dialogTableVisible.value = true
}

function selectArticleChange(selectArticle: ArticleItem[]) {
  selectArticleList.value = selectArticle
}
</script>

<template>
  <SubComponentTitle/>
  <EditForm :editFormConfig="topicEditFormConfig">
  </EditForm>
  <el-button type="primary" plain @click="showDialog">选择文章</el-button>
  <el-button type="danger" plain>删除文章</el-button>
  <SelectArticleTable :dataSource="selectArticleList" @selectionChange="selectArticleChange"/>
  <ArticleSelectDialog :dialogTableVisible="dialogTableVisible" @selectArticleChange="selectArticleChange"/>
</template>

<style scoped>

</style>