<script setup lang="ts">

import {Editor, Toolbar} from "@wangeditor/editor-for-vue";
import {ref, shallowRef} from "vue";

const editorRef = shallowRef()
const editorMode = ref<string>('default')
const editorValue = ref<string>('')

function handleEditorCreated(editor: Editor) {
  editorRef.value = editor
}
</script>

<template>
  <div id="content-editor" class="editor_border">
    <Toolbar class="editor_border" :editor="editorRef" :mode="editorMode"></Toolbar>
    <Editor v-model="editorValue" :mode="editorMode" @onCreated="handleEditorCreated"></Editor>
  </div>
</template>

<style scoped>
.editor_border {
  border: 1px solid #ccc;
}

</style>