<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css'
import {Editor, Toolbar} from "@wangeditor/editor-for-vue";
import {onBeforeUnmount, onMounted, ref, shallowRef} from "vue";
import {ContentItem} from "../../type/ContentItem.ts";
import {getContentById} from "../../api/content.ts";
import {useRoute} from "vue-router";

const contentItem = ref<ContentItem>(new ContentItem())
const route = useRoute()
const editorRef = shallowRef()
const toolbarConfig = {}
const editorConfig = { placeholder: '请输入内容...' }
const mode = 'default'

onMounted(() => {
  let contentId: number = route.params.contentId
  queryContentItem(contentId)
})

onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor === null) {
    return
  }
  editor.destroy()
})

function queryContentItem(contentId: number) {
  getContentById(contentId).then(res => {
    contentItem.value = res.data
    editorRef.value.setHtml(contentItem.value.html)
  })
}

function handleCreated(editor: Editor) {
  editorRef.value = editor
}
</script>

<template>
<div class="content_edit_wrapper">
  <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode"/>
  <Editor :defaultConfig="editorConfig" :mode="mode" @onCreated="handleCreated"/>
</div>
</template>

<style scoped>

</style>