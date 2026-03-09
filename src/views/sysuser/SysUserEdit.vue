<script setup lang="ts">

import SubComponentTitle from "../../components/common/SubComponentTitle.vue";
import EditForm from "../../components/common/EditForm.vue";
import {useRoute, useRouter} from "vue-router";
import {computed, type ComputedRef, onMounted, ref} from "vue";
import {getUserInfo, modifySysUserInfo} from "../../api/sysUserApi.ts";
import {EditFormConfig, EditFormItem, FormOption, SubmitConfig} from "../../type/common/EditFormConfig.ts";
import type {SysUser} from "../../type/SysUser.ts";
import {getValidRoles} from "../../api/roleApi.ts";
import type {Role} from "../../type/Role.ts";
import {Plus} from "@element-plus/icons-vue";
import {ElMessage, type UploadFile} from "element-plus";

const sysUserEditFormConfig = ref<EditFormConfig>(new EditFormConfig())

const route = useRoute()
const router = useRouter()
const sysUserId = ref<number>()
const userInfo = ref<SysUser>()
const userAvatarFile: ComputedRef<UploadFile[]> = computed(() => {
  return [{url: userInfo.value?.avatar}]
})

onMounted(() => {
  sysUserId.value = Number(route.params.sysUserId)
  Promise.all([getUserInfo(sysUserId.value), getValidRoles()]).then(([res1, res2]) => {
    userInfo.value = res1.data
    sysUserEditFormConfig.value = defineSysUserEditFormConfig(res1.data, buildFormOptions(res2.data))
  })
})

function defineSysUserEditFormConfig(formValue: SysUser, options: FormOption[]) {
  const formConfig = new EditFormConfig()
  formConfig.submitConfig = new SubmitConfig((formValue: SysUser) => submitEditUser(formValue), '保存')
  formConfig.formItems = [
    EditFormItem.defineInputItem('用户名', 'username').setDisabled(true)
        .addRule({required: true, message: '用户名不能为空', trigger: 'blur'}),
    EditFormItem.defineInputItem('昵称', 'nickname').setPlaceholder('请输入用户昵称')
        .addRule({required: true, message: '请输入用户昵称', trigger: 'blur'}),
    EditFormItem.defineInputItem('邮箱', 'email').setPlaceholder('请输入用户邮箱'),
    EditFormItem.defineInputItem('电话', 'tel').setPlaceholder('请输入用户电话'),
    EditFormItem.defineSelectItem('角色', 'roleIdSet', options, undefined, true)
        .setPlaceholder('请选择适用角色').addRule({required: true, message: '请选择适用角色', trigger: 'blur'}),
    EditFormItem.defineTextarea('个人介绍', 'introduce').setPlaceholder('请输入个人介绍'),
    EditFormItem.defineSlotItem('头像', 'avatar'),
    EditFormItem.defineSwitchItem('是否启用', 'status', [false, true]),
  ]
  formConfig.openValidate()
  formConfig.formValue = formValue
  formConfig.wrapperWidthPercent = 30
  return formConfig
}

function buildFormOptions(roleList: Role[]) {
  return roleList.map(role => new FormOption(role.roleNameZh, role.id, role.id))
}

function submitEditUser(formValue: SysUser) {
  modifySysUserInfo(formValue, userAvatarFile.value[0].raw).then(() => {
    ElMessage.success('修改成功')
    router.push({name: 'SysUserList'})
  }).catch(error => ElMessage.error(error))
}

function selectAvatarFile(uploadFile: UploadFile) {
  userAvatarFile.value.pop()
  userAvatarFile.value.push(uploadFile)
}
</script>

<template>
<SubComponentTitle/>
  <EditForm :editFormConfig="sysUserEditFormConfig">
    <template #avatar>
      <el-upload :file-list="userAvatarFile" :limit="1" list-type="picture-card" :on-change="selectAvatarFile"
        accept="image/*" :auto-upload="false">
        <el-icon class="user-avatar-upload-icon"><Plus /></el-icon>
      </el-upload>
    </template>
  </EditForm>
</template>

<style scoped>
</style>