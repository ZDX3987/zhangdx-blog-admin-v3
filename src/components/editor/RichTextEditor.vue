<script setup lang="ts">
import E from 'wangeditor'
import {onMounted, ref} from "vue";

const editorRef = ref<E>()

onMounted(() => {
  initEditor()
})

defineExpose({
  setHtml,
  getHtml
})

function initEditor() {
  const editor = new E('#richTextEditor')
  editor.config.pasteFilterStyle = false
  editor.config.placeholder = '请输入内容...'
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
</script>

<template>
  <div id="richTextEditor"></div>
</template>

<style scoped>

</style>