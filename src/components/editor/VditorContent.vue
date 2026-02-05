<script setup lang="ts">
import Vditor from 'vditor'
import "vditor/dist/index.css"
import {onMounted, ref} from "vue";
import {formatUploadResponse, handleCustomUpload} from "../../utils/vditor-util.ts";

const vditor = ref<Vditor>()
const props = defineProps({
  articleId: undefined
})

onMounted(() => {
  vditor.value = initVditor()
})

function initVditor(): Vditor {
  return new Vditor('vditorContent', {
    minHeight: 500,
    placeholder: '请在此处输入内容...',
    counter: {enable: true, type: "text"},
    cache: {enable: false},
    mode: 'sv',
    blur(value: string) {
      console.log(value)
    },
    upload: {
      url: '/api/article/article/upload',
      handler(files: File[]): string | Promise<string> | Promise<null> | null {
        return handleCustomUpload(props.articleId, files, vditor.value)
      },
      format(files: File[], responseText: string): string {
        return formatUploadResponse(files, responseText)
      }
    }
  })
}
</script>

<template>
<div id="vditorContent" class="vditor_content"></div>
</template>

<style scoped>
.vditor_content {
  margin: 20px 0;
}
</style>