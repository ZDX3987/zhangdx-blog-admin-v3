import {createRouter, createWebHistory} from "vue-router";
import {getAuthorization} from "../utils/auth-storage.ts";
import {ElMessage} from 'element-plus'
import systemSettingRoute from "./system-setting.ts"

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
                component: () => import('../views/article/ArticleManage.vue'),
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
                        component: () => import('../views/article/ArticleEdit.vue'),
                        meta: {title: '发布文章'},
                    },
                    {
                        path: 'edit/:articleId',
                        name: 'EditArticle',
                        component: () => import('../views/article/ArticleEdit.vue'),
                        meta: {title: '编辑文章'},
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
                redirect: {name: 'TopicList'},
                component: () => import('../views/topic/TopicManage.vue'),
                children: [
                    {
                        path: 'list',
                        name: 'TopicList',
                        meta: {title: '专栏列表'},
                        component: () => import('../views/topic/TopicList.vue'),
                    },
                    {
                        path: 'edit/:topicId',
                        name: 'TopicEdit',
                        meta: {title: '编辑专栏'},
                        component: () => import('../views/topic/TopicEdit.vue'),
                    },
                    {
                        path: 'add',
                        name: 'TopicAdd',
                        meta: {title: '新建专栏'},
                        component: () => import('../views/topic/TopicEdit.vue'),
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
                        path: 'edit/:categoryId',
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
                    },
                    {
                        path: 'edit/:viewId',
                        name: 'CategoryViewEdit',
                        component: () => import('../views/category/CategoryViewEdit.vue'),
                        meta: {title: '编辑视图'},
                    }
                ]
            },
            {
                path: 'content',
                name: 'ContentManage',
                component: () => import('../views/content/ContentManage.vue'),
                meta: {title: '内容管理'},
                redirect: {name: 'ContentList'},
                children: [
                    {
                        path: 'list',
                        name: 'ContentList',
                        component: () => import('../views/content/ContentList.vue'),
                        meta: {title: '内容列表'},
                    },
                    {
                        path: 'add',
                        name: 'ContentAdd',
                        component: () => import('../views/content/ContentEdit.vue'),
                        meta: {title: '新增内容'},
                    },
                    {
                        path: 'edit/:contentId',
                        name: 'ContentEdit',
                        component: () => import('../views/content/ContentEdit.vue'),
                        meta: {title: '编辑内容'},
                    }
                ]
            },
            {
                path: 'settings/update-Log',
                name: 'UpdateLogManage',
                component: () => import('../views/updatelog/UpdateLogManage.vue'),
                meta: {title: '更新日志'},
                redirect: {name: 'ContentList'},
                children: [
                    {
                        path: 'list',
                        name: 'UpdateLogList',
                        component: () => import('../views/updatelog/UpdateLogList.vue'),
                        meta: {title: '日志列表'},
                    },
                    {
                        path: 'add',
                        name: 'UpdateLogAdd',
                        component: () => import('../views/updatelog/UpdateLogEdit.vue'),
                        meta: {title: '新增日志'},
                    },
                    {
                        path: 'edit/:logId',
                        name: 'UpdateLogEdit',
                        component: () => import('../views/updatelog/UpdateLogEdit.vue'),
                        meta: {title: '编辑日志'},
                    }
                ]
            },
            ...systemSettingRoute
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