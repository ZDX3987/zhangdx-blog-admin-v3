import {createRouter, createWebHistory} from "vue-router";
import LoginPage from "../views/LoginPage.vue";
import Home from "../views/Home.vue";
import {getAuthorization} from "../utils/auth-storage.ts";
import { ElMessage } from 'element-plus'
import Layout from "../views/Layout.vue";
import ArticleList from "../views/article/ArticleList.vue";
import PublishArticle from "../views/article/PublishArticle.vue";
import DraftBox from "../views/article/DraftBox.vue";

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
        name: 'Layout',
        component: Layout,
        meta: {title: '首页'},
        redirect: {name: 'Home'},
        children: [
            {
                path: '/home',
                name: 'Home',
                component: Home,
                meta: {title: '首页'}
            },
            {
                path: '/article',
                name: 'ArticleManage',
                redirect: {name: 'ArticleList'},
                meta: {title: '文章管理'},
                children: [
                    {
                        path: 'list',
                        name: 'ArticleList',
                        component: ArticleList,
                        meta: {title: '文章列表'},
                    },
                    {
                        path: 'publish',
                        name: 'PublishArticle',
                        component: PublishArticle,
                        meta: {title: '发布文章'},
                    },
                    {
                        path: 'draftbox',
                        name: 'DraftBox',
                        component: DraftBox,
                        meta: {title: '草稿箱'},
                    }
                ]
            },
        ]
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