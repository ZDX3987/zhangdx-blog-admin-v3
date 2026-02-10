<script setup lang="ts">

import SubComponentTitle from "../../components/common/SubComponentTitle.vue";
import EditForm from "../../components/common/EditForm.vue";
import {onMounted, ref} from "vue";
import {EditFormConfig, EditFormItem, FormOption, SubmitConfig} from "../../type/common/EditFormConfig.ts";
import {useRoute, useRouter} from "vue-router";
import {FriendshipLinkItem} from "../../type/FriendshipLinkItem.ts";
import {getFriendshipLinkItem, saveFriendshipLinkItem} from "../../api/friendshipLinkApi.ts";
import {ElMessage} from "element-plus";

const router = useRouter()
const route = useRoute()
const friendshipLinkEditFormConfig = ref<EditFormConfig>(new EditFormConfig())
const linkId = ref<number>()
const commonStatusOptions: FormOption[] = [
  {label: '待审核', value: -1, key: -1},
  {label: '无效', value: 0, key: 0},
  {label: '有效', value: 1, key: 1}
]

onMounted(() => {
  linkId.value = Number(route.params.linkId)
  if (linkId.value) {
    getFriendshipLinkItem(linkId.value).then(res => {
      friendshipLinkEditFormConfig.value = defineLinkEditFormConfig(res.data)
    })
  } else {
    friendshipLinkEditFormConfig.value = defineLinkEditFormConfig(new FriendshipLinkItem())
  }
})

function defineLinkEditFormConfig(formValue: FriendshipLinkItem): EditFormConfig {
  const formConfig = new EditFormConfig()
  formConfig.formValue = formValue
  formConfig.wrapperWidthPercent = 30
  formConfig.formItems = [
    EditFormItem.defineInputItem('网站名称', 'linkName').setPlaceholder('请输入网站名称')
        .addRule({required: true, message: '请输入网站名称', trigger: 'blur'}),
    EditFormItem.defineInputItem('网站地址', 'linkUrl').setPlaceholder('请输入网站地址')
        .addRule({required: true, message: '请输入网站地址', trigger: 'blur'}),
    EditFormItem.defineTextarea('网站描述', 'linkDesc').setPlaceholder('请输入网站描述'),
    EditFormItem.defineSelectItem('状态', 'status', commonStatusOptions).setPlaceholder('请选择状态'),
  ]
  formConfig.openValidate()
  formConfig.submitConfig = new SubmitConfig(submitLink, '保存')
  return formConfig;
}

function submitLink(linkItem: FriendshipLinkItem) {
  saveFriendshipLinkItem(linkItem).then(() => {
    ElMessage.success('保存成功')
    router.push({name: 'FriendshipLinkManage'})
  }).catch(error => ElMessage.error(error))
}
</script>

<template>
  <SubComponentTitle/>
  <EditForm :editFormConfig="friendshipLinkEditFormConfig"/>
</template>

<style scoped>

</style>