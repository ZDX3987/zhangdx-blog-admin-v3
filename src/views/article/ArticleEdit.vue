<script setup lang="ts">

import EditForm from "../../components/common/EditForm.vue";
import {onMounted, ref} from "vue";
import {EditFormConfig, EditFormItem} from "../../type/common/EditFormConfig.ts";
import {useRoute} from "vue-router";
import {doSaveArticle, doSaveDraftArticle, getArticleById} from "../../api/articelApi.ts";
import {ArticleExtraData, ArticleItem, PreviewConfig} from "../../type/ArticleItem.ts";
import CategorySelectDialog from "../../components/dialog/CategorySelectDialog.vue";
import type {CategoryItem} from "../../type/CategoryItem.ts";
import MarkdownContent from "../../components/editor/MarkdownContent.vue";
import {ElMessage} from "element-plus";

const route = useRoute()
const articleEditFormConfig = ref<EditFormConfig>()
const articleId = ref<number>()
const articleInfo = ref<ArticleItem>(new ArticleItem())
const categorySelectDialogRef = ref<InstanceType<typeof CategorySelectDialog>>()
const coverImgFileList = ref<File[]>([])
const editorName = ref<string>('markdown')
const markdownContentRef = ref<InstanceType<typeof MarkdownContent>>()

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
  formConfig.resettable = false
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
  handleArticleText(articleForm)
  doSaveDraftArticle(articleForm).then(res => {
    articleInfo.value = res.data
    callback(articleInfo.value.text)
    ElMessage.success('已保存到草稿箱')
  }).catch(() => ElMessage.error('保存草稿箱失败'))
}

function saveToAudit() {
  saveRealArticle('待审核')
}

function saveRealArticle(articleStatus: string) {
  const articleForm = articleInfo.value
  handleArticleText(articleForm)
  articleForm.status = articleStatus
  doSaveArticle(coverImgFileList.value[0], articleForm).then(res => {
    ElMessage.success(res.msg)
  }).catch(error => ElMessage.error(error))
}

function handleArticleText(article: ArticleItem) {
  if (editorName.value === 'markdown') {
    article.text = markdownContentRef.value?.getEditorValue()
    article.digest = genArticleDigest(markdownContentRef.value?.getEditorText(), 100)
    article.extraData = new ArticleExtraData(new PreviewConfig().setVditorPreview(markdownContentRef.value?.genEditorPreviewConfig()))
    article.source = 2
  } else {

  }
}

function genArticleDigest(text: string, length: number): string {
  return text ? text.substring(0, length) : '';
}

function editorInsert(callback: Function) {
  saveDraftArticle(callback)
}
</script>

<template>
  <div>
    <el-row>
      <el-col :span="12">
        <EditForm :editFormConfig="articleEditFormConfig">
          <template #articleCategory>
            <el-tag class="article-cate-list" v-for="cate in articleInfo.categories" :key="cate.id" closable
                    @close="removeSelectCategory(cate)">
              {{ cate.cateName }}
            </el-tag>
            <el-button type="primary" size="small" @click="showCategoryDialog">添加标签</el-button>
          </template>
        </EditForm>
      </el-col>
      <el-col :span="6" :offset="6">
        <el-button-group>
          <el-button type="primary" plain v-if="editorName === 'markdown'">导入MarkDown</el-button>
          <el-tooltip class="item" effect="dark" content="提交至管理员审核" placement="top-start">
            <el-button :disabled="!articleInfo.id" type="primary" @click="saveToAudit">发布</el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="保存本次修改" placement="top-end">
            <el-button :disabled="!articleInfo.id" type="primary" @click="saveRealArticle(articleInfo.status)">保存</el-button>
          </el-tooltip>
        </el-button-group>
      </el-col>
    </el-row>
    <el-tabs class="article-editor-tabs" v-model="editorName">
      <el-tab-pane label="Markdown编辑器" name="markdown">
        <MarkdownContent :articleEditInfo="articleInfo" ref="markdownContentRef" @editorInsert="editorInsert"/>
      </el-tab-pane>
      <el-tab-pane label="富文本编辑器" name="richText"></el-tab-pane>
    </el-tabs>
  </div>
  <CategorySelectDialog ref="categorySelectDialogRef" @selectSingleCategory="selectSingleCategory"/>
</template>

<style scoped>
.article-cate-list {
  margin-right: 10px;
}
</style>