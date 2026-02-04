<script setup lang="ts">
import {ref, watch} from "vue";
import SelectArticleTable from "../article/SelectArticleTable.vue";
import type {ArticleItem} from "../../type/ArticleItem.ts";

const emit = defineEmits(['confirmSelectArticle', 'closeDialog'])
const props = defineProps({
  dialogTableVisible: Boolean,
})

const dialogTableVisible = ref<boolean>(false)
const selectArticleList = ref<ArticleItem[]>([])

watch(props, (newProps) => {
  dialogTableVisible.value = newProps.dialogTableVisible
})

function selectArticleChange(newSelection: ArticleItem[]) {
  selectArticleList.value = newSelection
}

function confirmSelectArticle() {
  emit('confirmSelectArticle', selectArticleList.value)
  closeDialog()
}

function closeDialog() {
  dialogTableVisible.value = false
  emit('closeDialog')
}

</script>

<template>
<el-dialog v-model="dialogTableVisible" title="请选择文章" width="800" @close="closeDialog">
<SelectArticleTable @selectionChange="selectArticleChange"/>
  <template #footer>
    <el-button type="primary" @click="confirmSelectArticle">确认</el-button>
  </template>
</el-dialog>
</template>

<style scoped>

</style>