import {createRouter, createWebHistory} from "vue-router";
import LoginPage from "../views/LoginPage.vue";
import Home from "../views/Home.vue";
import {getAuthorization} from "../utils/auth-storage.ts";
import { ElMessage } from 'element-plus'

const loginRoute = {
        path: '/login',
        name: 'Login',
        component: LoginPage,
        meta: {title: '登录'}
}

const routes = [
    loginRoute,
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {title: '首页'}
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,

})
router.beforeEach((to) => {
    if (to.name !== loginRoute.name && getAuthorization() === null) {
        router.push({name: loginRoute.name}).then(() => {
            ElMessage.warning('您还没有登录，请先登录')
        })
    }
})
export default router