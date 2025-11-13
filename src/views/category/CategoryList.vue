<script setup lang="ts">

import {getAllCategory} from "../../api/categoryApi.ts";
import {ref} from "vue";
import type {CategoryItem} from "../../type/CategoryItem.ts";
import {ResultPage} from "../../type/ResultPage.ts";

const pageSize = ref<number>(10)
const currentPage = ref<number>(1)
const categoryTableList = ref<CategoryItem>()

function queryCategory(pageSize: number, currentPage: number) {
  getAllCategory(pageSize, currentPage).then(res => {
    categoryTableList.value = ResultPage.build<CategoryItem>(res.data, CategoryItem).records
  })
}
</script>

<template>
<div class="category_list_content">
  <div class="category_list_table">

  </div>
</div>
</template>

<style scoped>

</style>