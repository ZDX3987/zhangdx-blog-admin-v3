<script setup lang="ts">
import {ref, watch} from "vue";
import SelectArticleTable from "../article/SelectArticleTable.vue";
import type {ArticleItem} from "../../type/ArticleItem.ts";

const emit = defineEmits(['confirmSelectArticle', 'closeDialog'])
const props = defineProps({
  dialogTableVisible: Boolean,
})

const dialogTableVisible = ref<boolean>(false)
const selectArticleTableRef = ref<InstanceType<typeof SelectArticleTable>>()
watch(props, (newProps) => {
  dialogTableVisible.value = newProps.dialogTableVisible
})

defineExpose({
  setSelectedArticleList
})

function confirmSelectArticle() {
  emit('confirmSelectArticle', selectArticleTableRef.value?.getSelectedArticleList())
  closeDialog()
}

function closeDialog() {
  dialogTableVisible.value = false
  emit('closeDialog')
}

function setSelectedArticleList(newSelection: ArticleItem[]) {
  selectArticleTableRef.value?.setSelectedArticleList(newSelection)
}
</script>

<template>
<el-dialog v-model="dialogTableVisible" title="请选择文章" width="800" @close="closeDialog">
<SelectArticleTable ref="selectArticleTableRef"/>
  <template #footer>
    <el-button type="primary" @click="confirmSelectArticle">确认</el-button>
  </template>
</el-dialog>
</template>

<style scoped>

</style>