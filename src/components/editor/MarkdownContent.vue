<script setup lang="ts">
import Vditor from 'vditor'
import "vditor/dist/index.css"
import {onMounted, ref, watch} from "vue";
import {formatUploadResponse, getTextFromHtml, handleCustomUpload} from "../../utils/vditor-util.ts";
import {type VditorPreview} from "../../type/ArticleItem.ts";

const mdEditor = ref<Vditor>()
const props = defineProps({
  markdownText: {
    type: String,
    default: ''
  },
  contentKey: {
    type: Number
  }
})
const emit = defineEmits(['editorInsert'])

watch(() => props.markdownText, (newValue) => {
  mdEditor.value?.setValue(newValue)
})

onMounted(() => {
  mdEditor.value = initEditor()
})

defineExpose({
  getEditorValue,
  getEditorText,
  genEditorPreviewConfig,
  clearEditorText
})

function initEditor(): Vditor {
  return new Vditor('mdEditorContent', {
    minHeight: 500,
    placeholder: '请在此处输入内容...',
    counter: {enable: true, type: "text"},
    cache: {enable: false},
    mode: 'sv',
    blur(value: string) {
      if (value === '\n' || props.contentKey) {
        return;
      }
      emit('editorInsert', (text: string) => mdEditor.value?.setValue(text, true))
    },
    upload: {
      url: '/api/article/article/upload',
      handler(files: File[]): string | Promise<string> | Promise<null> | null {
        const contentKey: number = props.contentKey
        if (contentKey) {
          handleCustomUpload(contentKey, files, mdEditor.value)
        } else {
          emit('editorInsert', () => handleCustomUpload(contentKey, files, mdEditor.value))
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

function clearEditorText(): any {
  if (mdEditor.value) {
    mdEditor.value.deleteValue()
  }
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