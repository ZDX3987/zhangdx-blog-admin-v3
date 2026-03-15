<script setup lang="ts">
import E from 'wangeditor'
import {onMounted, ref, watch} from "vue";

const editorRef = ref<E>()
const props = defineProps({
  contentText: {
    type: String,
  },
  contentKey:  {
    type: Number,
    default: 1
  },
  contentUploadUrl:  {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['editorInsert'])

defineExpose({
  getHtml
})

watch(() => props.contentText, (newValue) => {
  if (newValue) {
    setHtml(newValue)
  }
})

onMounted(() => {
  initEditor()
  if (props.contentText) {
    setHtml(props.contentText)
  }
})

function initEditor() {
  const editor = new E('#richTextEditor')
  editor.config.pasteFilterStyle = false
  editor.config.placeholder = '请输入内容...'
  editor.config.onblur = editorBlur
  editor.create()
  editorRef.value = editor
}

function setHtml(htmlValue: string): void {
  if (editorRef.value) {
    editorRef.value.txt.html(htmlValue)
  }
}

function getHtml(): string {
  if (editorRef.value) {
    return editorRef.value.txt.html()
  }
  return ''
}

function editorBlur(): void {
  emit('editorInsert', () => {})
}
</script>

<template>
  <div id="richTextEditor" class="rich-text-editor-content"></div>
</template>

<style scoped>
</style>