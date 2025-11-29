<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from "vue";
import {ContentItem} from "../../type/ContentItem.ts";
import {getContentById} from "../../api/content.ts";
import {useRoute} from "vue-router";

const contentItem = ref<ContentItem>(new ContentItem())
const route = useRoute()

onMounted(() => {
  let contentId: number = route.params.contentId
  queryContentItem(contentId)
})

onBeforeUnmount(() => {

})

function queryContentItem(contentId: number) {
  getContentById(contentId).then(res => {
    contentItem.value = res.data
  })
}

</script>

<template>
<div class="content_edit_wrapper">
</div>
</template>

<style scoped>

</style>