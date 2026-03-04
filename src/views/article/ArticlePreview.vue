<script setup lang="ts">

import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import type {ArticleItem} from "../../type/ArticleItem.ts";
import {getArticleById} from "../../api/articelApi.ts";
import {ElMessage} from "element-plus";
import MarkdownContent from "../../components/editor/MarkdownContent.vue";
import MarkdownPreview from "../../components/article/MarkdownPreview.vue";
import RichTextPreview from "../../components/article/RichTextPreview.vue";

const route = useRoute()
const articleInfo = ref<ArticleItem>()

onMounted(() => {
  const articleId = Number(route.params.articleId)
  if (articleId) {
    getArticleById(articleId).then(res => {
      articleInfo.value = res.data
    }).catch(err => ElMessage.error(err))
  }
})
</script>

<template>
  <div v-if="articleInfo">
    <h2>{{articleInfo.title}}</h2>
    <el-descriptions>
      <el-descriptions-item>
        <el-avatar :src="articleInfo.author.avatar"/>
      </el-descriptions-item>
      <el-descriptions-item>
        {{articleInfo.author.nickname}}
      </el-descriptions-item>
    </el-descriptions>
    <div class="article-text-content">
      <MarkdownPreview v-if="articleInfo.source === 2" :articleInfo="articleInfo"></MarkdownPreview>
      <RichTextPreview v-else-if="articleInfo.source === 1" :richText="articleInfo.text"></RichTextPreview>
    </div>
  </div>
</template>

<style scoped>
.article-text-content {

  max-width: 1000px;
}
</style>