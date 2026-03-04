<script setup lang="ts">
import VditorPreview from "vditor/dist/method.min";
import "vditor/dist/index.css";
import {onMounted, ref} from "vue";
import vditorPkg from 'vditor/package.json';
import {ArticleItem} from "../../type/ArticleItem.ts";

const props = defineProps({
  articleInfo: {
    type: ArticleItem,
    default: new ArticleItem()
  }
})
const renderTextRef = ref<HTMLDivElement | null>(null)

onMounted(() => {
  VditorPreview.mermaidRender(document)
  renderMarkdownText()
})

function renderMarkdownText() {
  VditorPreview.preview(renderTextRef.value, props.articleInfo.text, {
    lazyLoadImage: 'Loading',
    hljs: {
      style: getArticleExtraCodeTheme(),
      lineNumber: true
    },
    cdn: 'https://cdn.jsdelivr.net/npm/vditor@' + vditorPkg.version
  })
}

function getArticleExtraCodeTheme(): string {
  const article = props.articleInfo
  if (!article.extraData) {
    return ''
  }
  let codeTheme = ''
  let previewConfig = article.extraData.previewConfig
  if (previewConfig) {
    let vditorPreview = previewConfig.vditorPreview
    if (vditorPreview) {
      codeTheme = vditorPreview.hlStyle
    }
  }
  return codeTheme
}
</script>

<template>
  <div id="markdownText" class="vditor-reset" ref="renderTextRef"></div>
</template>

<style scoped>
</style>