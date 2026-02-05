<script setup lang="ts">

import SubComponentTitle from "../../components/common/SubComponentTitle.vue";
import EditForm from "../../components/common/EditForm.vue";
import {onMounted, ref} from "vue";
import {EditFormConfig, EditFormItem, SubmitConfig} from "../../type/common/EditFormConfig.ts";
import {TopicItem} from "../../type/TopicItem.ts";
import SelectArticleTable from "../../components/article/SelectArticleTable.vue";
import ArticleSelectDialog from "../../components/dialog/ArticleSelectDialog.vue";
import type {ArticleItem} from "../../type/ArticleItem.ts";
import {useRoute, useRouter} from "vue-router";
import {getTopicItem, saveTopicItem} from "../../api/topicApi.ts";
import {ElMessage} from "element-plus";

const route = useRoute()
const router = useRouter()
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
  formConfig.openValidate()
  formConfig.resettable = false
  formConfig.inline = true
  formConfig.submitConfig = new SubmitConfig(saveTopic, '保存')
  return formConfig
}

function saveTopic() {
  let topicForm = topicEditFormConfig.value.formValue
  if (selectArticleList.value.length === 0) {
    ElMessage.error('请选择文章')
  }
  topicForm.articleVOList = selectArticleList.value
  saveTopicItem(topicForm).then(() => {
    ElMessage.success('保存成功')
    router.push({name: 'TopicManage'})
  })
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
  <SelectArticleTable class="topic_select_article_table" :dataSource="selectArticleList" @unselectArticle="deleteSelectedArticle"/>
  <ArticleSelectDialog :dialogTableVisible="dialogTableVisible" @confirmSelectArticle="confirmSelectArticle" @closeDialog="toggleDialog" ref="dialogRef"/>
</template>

<style scoped>
.topic_select_article_table {
  width: 50%;
}
</style>