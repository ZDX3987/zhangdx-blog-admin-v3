<script setup lang="ts">

import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import type {ArticleItem} from "../../type/ArticleItem.ts";
import {getArticleById, toCheckArticle} from "../../api/articelApi.ts";
import {ElMessage} from "element-plus";
import MarkdownPreview from "../../components/article/MarkdownPreview.vue";
import RichTextPreview from "../../components/article/RichTextPreview.vue";
import {dateFormat} from "../../utils/moment-date.ts";
import {articleStatus, ArticleStatusEnum} from "../../utils/common-status.ts"

const route = useRoute()
const router = useRouter()
const articleInfo = ref<ArticleItem>()
const needAuditStatusText = [articleStatus[ArticleStatusEnum.SAVED].name, articleStatus[ArticleStatusEnum.TO_BE_REVIEWED].name]

onMounted(() => {
  const articleId = Number(route.params.articleId)
  if (articleId) {
    getArticleById(articleId).then(res => {
      articleInfo.value = res.data
    }).catch(err => ElMessage.error(err))
  }
})

function auditArticle() {
  if (!articleInfo.value) {
    return
  }
  const toStatus = articleInfo.value.status === needAuditStatusText[0] ? 1 : 2
  toCheckArticle(articleInfo.value.id, toStatus).then(res => {
    ElMessage.success(res.msg)
    router.push({name: 'ArticleList'})
  })
}
</script>

<template>
  <div id="article-preview-content" class="article-preview-content" v-if="articleInfo">
    <el-row align="middle">
      <el-col :span="12">
        <h2>{{articleInfo.title}}</h2>
      </el-col>
      <el-col :span="6" :offset="6" v-if="needAuditStatusText.includes(articleInfo.status)">
        <el-popconfirm v-if="articleInfo.status === needAuditStatusText[0]"
                       title="是否提交发布申请？" width="200" @confirm="auditArticle">
          <template #reference>
            <el-button type="primary">提交发布</el-button>
          </template>
        </el-popconfirm>
        <el-popconfirm v-else-if="articleInfo.status === needAuditStatusText[1]"
                       title="审核通过之后将会发布该文章，是否继续？" width="200" @confirm="auditArticle">
          <template #reference>
            <el-button type="primary">通过审核</el-button>
          </template>
        </el-popconfirm>
      </el-col>
    </el-row>
    <el-row class="article-sub-info">
      <el-col :span="4">
        <div class="article-sub-info-common">
          <span class="article-sub-info-left iconfont iconriqi"></span>
          <span>{{dateFormat(articleInfo.publishDate)}}</span>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="article-sub-info-common">
          <el-avatar :src="articleInfo.author.avatar"/>
          <span class="article-author-name">{{articleInfo.author.nickname}}</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="article-sub-info-common" v-if="articleInfo.categories.length > 0">
          <span class="article-sub-info-left iconfont iconbiaoqian"></span>
          <el-text v-for="(category, index) in articleInfo.categories" :key="category.id">
            <el-divider v-if="index !== 0" direction="vertical"/>
            <span>{{ category.cateName}}</span>
          </el-text>
        </div>
      </el-col>
    </el-row>
    <el-divider/>
    <el-image v-if="articleInfo.coverImg" :src="articleInfo.coverImg"></el-image>
    <div class="article-text-content">
      <MarkdownPreview v-if="articleInfo.source === 2" :articleInfo="articleInfo"></MarkdownPreview>
      <RichTextPreview v-else-if="articleInfo.source === 1" :richText="articleInfo.text"></RichTextPreview>
    </div>
  </div>
</template>

<style scoped>
.article-preview-content {
}
.article-text-content {
  max-width: 1000px;
}
.article-sub-info {
  height: 50px;
  line-height: 50px;
}
.article-sub-info-common {
  display: flex;
  align-items: center;
}
.article-sub-info-left {
  font-size: 20px;
  margin-right: 10px;
}
.article-author-name {
  margin-left: 10px;
}

</style>