<script setup lang="ts">
import Bg from "../components/common/Bg.vue";
import {onMounted, reactive, ref} from "vue";
import {User, Lock} from "@element-plus/icons-vue";
import type {LoginForm} from "../type/LoginForm.ts";
import {type FormInstance, type FormRules} from "element-plus";
import {login} from "../api/oauthApi.ts";
import {useRouter} from "vue-router";

const router = useRouter()
const loginFormRef = ref<FormInstance>()
const loginForm = reactive<LoginForm>({
  username: '',
  password: ''
})
const formRules = reactive<FormRules<LoginForm>>({
  username: { required: true, message: '请输入用户名', trigger: 'change' },
  password: { required: true, message: '请输入密码', trigger: 'change' },
})
const loginType = [
  {type: 'QQ', icon: 'iconfont iconQQ', color: 'rgb(94,164,210)', text: 'QQ'},
  {type: 'gitee', icon: 'iconfont iconmayun', color: 'rgb(178,53,37)', text: '码云'},
  {type: 'GITHUB', icon: 'iconfont iconhuaban881', color: 'rgb(51,51,51)', text: 'Github'},
  {type: 'FEISHU', icon: 'iconfont iconiconfeishuLOGO', color: 'rgb(76,114,252)', text: '飞书'}
]

onMounted(() => {
  enterLogin()
})

function enterLogin() {
  document.onkeydown = e => {
    if (e.keyCode === 13) {
      submitLogin(loginFormRef.value);
    }
  }
}

function submitLogin(formEl: FormInstance | undefined) {
  formEl?.validate(valid => {
    if (valid) {
      login(loginForm).then(res => {
        router.push({name: 'Layout'})
      })
    }
  })
}

</script>

<template>
  <div class="login-logo-content">
    <el-image src="http://file.zhangdx.cn/asserts/icon.svg"/>
  </div>
  <el-row type="flex" justify="center">
    <el-col :xl="6" :md="10">
      <div class="login_content">
        <h2 class="login_title">登录</h2>
        <div class="login_form_content">
          <el-form :model="loginForm" :rules="formRules" ref="loginFormRef">
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" placeholder="请输入用户名" :prefix-icon="User"/>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="loginForm.password" type="password" show-password placeholder="请输入密码" :prefix-icon="Lock"/>
            </el-form-item>
            <el-form-item>
              <el-button class="login_btn" type="primary" @click="submitLogin(loginFormRef)">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="login_social_content">
          <el-text class="login_social_label">快捷登录：</el-text>
          <span class="login_social_item" v-for="socialType in loginType" :key="socialType.type" :class="socialType.icon"
                :title="socialType.text" :style="{color:socialType.color}">
          </span>
        </div>
      </div>
    </el-col>
  </el-row>
  <Bg/>
</template>

<style scoped>
.login-logo-content {
  width: 80px;
  height: 80px;
  top: 3rem;
  left: 5rem;
  position: absolute;
}
.login_content {
  background-color: rgba(255, 255, 255, 0.2);
  position: relative;
  padding: 2rem 5rem;
  border-radius: 5px;
  margin-top: 35%;
  min-height: 25%;
}
.login_title {
  color: rgb(176, 183, 189);
  text-align: center;
}

.login_btn {
  width: 100%;
  height: 40px;
  margin-top: 1rem;
}
.el-input >>> input {
  font-size: 110%;
  color: #fff;
}
.el-input >>> .el-input__wrapper {
  background-color: rgba(239, 241, 244, 0);
  border: none;
  border-bottom: 1px solid rgb(117, 120, 122);
  height: 50px;
  box-shadow: none;
}
.login_social_content {
  margin-top: 30px;
  height: 30px;
  text-align: center;
}
.login_social_label {
  color: rgb(176, 183, 189);
}
.login_social_item {
  font-size: 30px;
  margin: 0 1rem;
}
</style>