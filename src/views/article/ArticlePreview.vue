<script setup lang="ts">

import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import type {ArticleItem} from "../../type/ArticleItem.ts";
import {getArticleById} from "../../api/articelApi.ts";
import {ElMessage} from "element-plus";

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
</div>
</template>

<style scoped>
</style>