<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import SelectArticleTable from "../article/SelectArticleTable.vue";
import type {ArticleItem} from "../../type/ArticleItem.ts";

const emit = defineEmits(['selectArticleChange'])
const props = defineProps({
  dialogTableVisible: Boolean,
})

const dialogTableVisible = ref<boolean>(false)
const selectArticleList = ref<ArticleItem[]>([])

watch(props, (newProps) => {
  dialogTableVisible.value = newProps.dialogTableVisible
})
onMounted(() => {
})

function selectArticleChange(newSelection: ArticleItem[]) {
  selectArticleList.value = newSelection
}

function confirmSelectArticle() {
  dialogTableVisible.value = false
  emit('selectArticleChange', selectArticleList.value)
}

</script>

<template>
<el-dialog v-model="dialogTableVisible" title="请选择文章" width="800">
<SelectArticleTable @selectionChange="selectArticleChange"/>
  <template #footer>
    <el-button type="primary" @click="confirmSelectArticle">确认</el-button>
  </template>
</el-dialog>
</template>

<style scoped>

</style>