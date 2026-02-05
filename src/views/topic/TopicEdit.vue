<script setup lang="ts">

import SubComponentTitle from "../../components/common/SubComponentTitle.vue";
import EditForm from "../../components/common/EditForm.vue";
import {onMounted, ref} from "vue";
import {EditFormConfig, EditFormItem, SubmitConfig} from "../../type/common/EditFormConfig.ts";
import {TopicItem} from "../../type/TopicItem.ts";
import SelectArticleTable from "../../components/article/SelectArticleTable.vue";
import ArticleSelectDialog from "../../components/dialog/ArticleSelectDialog.vue";
import type {ArticleItem} from "../../type/ArticleItem.ts";
import {useRoute} from "vue-router";
import {getTopicItem, saveTopicItem} from "../../api/topicApi.ts";
import type {ApiResponse} from "../../api/axios.ts";

const route = useRoute()
const topicEditFormConfig = ref<EditFormConfig>(new EditFormConfig())
const dialogTableVisible = ref<boolean>(false)
const dialogRef = ref<InstanceType<typeof ArticleSelectDialog>>()
const selectArticleList = ref<ArticleItem[]>([])
const topicId = ref<number>()

onMounted(() => {
  topicId.value = Number(route.params.topicId)
  if (topicId.value) {
    getTopicItem(topicId.value).then(res => {
      topicEditFormConfig.value = defineTopicEditFormConfig(res.data)
      selectArticleList.value = res.data.articleVOList
    })
  } else {
    topicEditFormConfig.value = defineTopicEditFormConfig(new TopicItem())
  }
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

function saveTopic(): Promise<ApiResponse<any>> {
  let topicForm = topicEditFormConfig.value.formValue
  topicForm.articleVOList = selectArticleList.value
  return saveTopicItem(topicForm)
}

function showDialog() {
  toggleDialog()
  dialogRef.value?.setSelectedArticleList(selectArticleList.value)
}

function toggleDialog() {
  dialogTableVisible.value = !dialogTableVisible.value
}

function confirmSelectArticle(selectArticle: ArticleItem[]) {
  selectArticleList.value = selectArticle
  dialogTableVisible.value = false
}

function deleteSelectedArticle(articleId: number) {
  selectArticleList.value = selectArticleList.value.filter(item => item.id !== articleId)
}
</script>

<template>
  <SubComponentTitle/>
  <EditForm :editFormConfig="topicEditFormConfig">
  </EditForm>
  <el-button type="primary" plain @click="showDialog">选择文章</el-button>
  <el-button type="danger" plain>删除文章</el-button>
  <SelectArticleTable :dataSource="selectArticleList" @unselectArticle="deleteSelectedArticle"/>
  <ArticleSelectDialog :dialogTableVisible="dialogTableVisible" @confirmSelectArticle="confirmSelectArticle" @closeDialog="toggleDialog" ref="dialogRef"/>
</template>

<style scoped>

</style>