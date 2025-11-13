import {createRouter, createWebHistory} from "vue-router";
import {getAuthorization} from "../utils/auth-storage.ts";
import {ElMessage} from 'element-plus'

const loginRoute = {
        path: '/login',
        name: 'Login',
        component: () => import('../views/LoginPage.vue'),
        meta: {title: '登录'}
}

const routes = [
    loginRoute,
    {
        path: '/',
        name: 'Layout',
        component: () => import('../views/Layout.vue'),
        meta: {title: '首页'},
        redirect: {name: 'Home'},
        children: [
            {
                path: '/home',
                name: 'Home',
                component: () => import('../views/Home.vue'),
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
                        component: () => import('../views/article/ArticleList.vue'),
                        meta: {title: '文章列表'},
                    },
                    {
                        path: 'publish',
                        name: 'PublishArticle',
                        component: () => import('../views/article/PublishArticle.vue'),
                        meta: {title: '发布文章'},
                    },
                    {
                        path: 'draftbox',
                        name: 'DraftBox',
                        component: () => import('../views/article/DraftBox.vue'),
                        meta: {title: '草稿箱'},
                    }
                ]
            },
            {
                path: 'topic',
                name: 'TopicManage',
                meta: {title: '专栏管理'},
                children: [
                    {
                        path: 'list',
                        name: 'TopicList',
                        meta: {title: '专栏列表'},
                        component: () => import('../views/topic/TopicList.vue'),
                    }
                ]
            },
            {
                path: 'category',
                name: 'CategoryManage',
                meta: {title: '标签管理'},
                children: [
                    {
                        path: 'list',
                        meta: {title: '标签列表'},
                        name: 'CategoryList',
                        component: () => import('../views/category/CategoryList.vue'),
                    }
                ]
            }
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