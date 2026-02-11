<script setup lang="ts">
import Vditor from 'vditor'
import "vditor/dist/index.css"
import {onMounted, ref, watch} from "vue";
import {formatUploadResponse, getTextFromHtml, handleCustomUpload} from "../../utils/vditor-util.ts";
import {ArticleItem, type VditorPreview} from "../../type/ArticleItem.ts";

const mdEditor = ref<Vditor>()
const props = defineProps({
  articleEditInfo: ArticleItem
})
const emit = defineEmits(['editorInsert'])

watch(() => props.articleEditInfo, (newValue) => {
  mdEditor.value?.setValue(newValue.text)
})

onMounted(() => {
  mdEditor.value = initEditor()
})

defineExpose({
  getEditorValue,
  getEditorText,
  genEditorPreviewConfig
})

function initEditor(): Vditor {
  return new Vditor('mdEditorContent', {
    minHeight: 500,
    placeholder: '请在此处输入内容...',
    counter: {enable: true, type: "text"},
    cache: {enable: false},
    mode: 'sv',
    blur(value: string) {
      if (value === '\n' || props.articleEditInfo?.id) {
        return;
      }
      emit('editorInsert', (text: string) => mdEditor.value?.setValue(text, true))
    },
    upload: {
      url: '/api/article/article/upload',
      handler(files: File[]): string | Promise<string> | Promise<null> | null {
        const articleId: number = props.articleEditInfo?.id
        if (articleId) {
          handleCustomUpload(articleId, files, mdEditor.value)
        } else {
          emit('editorInsert', () => handleCustomUpload(articleId, files, mdEditor.value))
        }
      },
      format(files: File[], responseText: string): string {
        return formatUploadResponse(files, responseText)
      }
    }
  })
}

function getEditorValue(): string {
  return mdEditor.value?.getValue() || ''
}
function getEditorText(): string {
  return getTextFromHtml(mdEditor.value?.getHTML() || '')
}

function genEditorPreviewConfig(): VditorPreview | undefined {
  return mdEditor.value ? {
    hlStyle: mdEditor.value.vditor.options.preview?.hljs?.style || ''
  } : undefined
}
</script>

<template>
<div id="mdEditorContent" class="editor_content"></div>
</template>

<style scoped>

</style>