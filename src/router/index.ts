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
                path: '/index',
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
                component: () => import('../views/category/CategoryManage.vue'),
                meta: {title: '标签管理'},
                redirect: {name: 'CategoryList'},
                children: [
                    {
                        path: 'list',
                        meta: {title: '标签列表'},
                        name: 'CategoryList',
                        component: () => import('../views/category/CategoryList.vue'),
                    },
                    {
                        path: 'add',
                        meta: {title: '新建标签'},
                        name: 'CategoryAdd',
                        component: () => import('../views/category/CategoryEdit.vue'),
                    },
                    {
                        path: 'edit',
                        meta: {title: '编辑标签'},
                        name: 'CategoryEdit',
                        component: () => import('../views/category/CategoryEdit.vue'),
                    }
                ]
            },
            {
                path: 'categoryView',
                name: 'CategoryViewManage',
                component: () => import('../views/category/CategoryView.vue'),
                meta: {title: '标签分类视图管理'},
                redirect: {name: 'CategoryViewList'},
                children: [
                    {
                        path: 'list',
                        name: 'CategoryViewList',
                        component: () => import('../views/category/CategoryViewList.vue'),
                        meta: {title: '视图列表'},
                    },
                    {
                        path: 'add',
                        name: 'CategoryViewAdd',
                        component: () => import('../views/category/CategoryViewEdit.vue'),
                        meta: {title: '新增视图'},
                    }
                ]
            },
            {
                path: 'systemPermissionManage',
                name: 'PermissionManage',
                component: () => import('../views/permission/PermissionManage.vue'),
                meta: {title: '系统权限管理'},
                redirect: {name: 'PermissionList'},
                children: [
                    {
                        path: 'list',
                        name: 'PermissionList',
                        component: () => import('../views/permission/PermissionList.vue'),
                        meta: {title: '权限列表'},
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