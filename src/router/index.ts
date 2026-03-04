import {createRouter, createWebHistory, type RouteLocationNormalizedGeneric} from "vue-router";
import {getAuthorization} from "../utils/auth-storage.ts";
import {ElMessage} from 'element-plus'
import systemSettingRoute from "./system-setting.ts"
import {useMainStore} from "../pinia";

const loginRoute = {
        path: '/login',
        name: 'Login',
        component: () => import('../views/LoginPage.vue'),
        meta: {title: '登录', withoutPermissionCheck: true}
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
                meta: {title: '首页', permissionCode: 'backend:home'}
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
                        meta: {title: '文章列表', permissionCode: 'backend:articleManage:list'},
                    },
                    {
                        path: 'publish',
                        name: 'PublishArticle',
                        component: () => import('../views/article/ArticleEdit.vue'),
                        meta: {title: '发布文章', permissionCode: 'backend:articleManage:publish'},
                    },
                    {
                        path: 'edit/:articleId',
                        name: 'EditArticle',
                        component: () => import('../views/article/ArticleEdit.vue'),
                        meta: {title: '编辑文章', permissionCode: 'backend:articleManage:edit'},
                    },
                    {
                        path: 'draftbox',
                        name: 'DraftBox',
                        component: () => import('../views/article/DraftBox.vue'),
                        meta: {title: '草稿箱', permissionCode: 'backend:articleManage:draftbox'},
                    },
                    {
                        path: 'preview/:articleId',
                        name: 'ArticlePreview',
                        component: () => import('../views/article/ArticlePreview.vue'),
                        meta: {title: '预览文章', permissionCode: 'backend:articleManage:preview'},
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
                        meta: {title: '专栏列表', permissionCode: 'backend:topicManage:list'},
                        component: () => import('../views/topic/TopicList.vue'),
                    },
                    {
                        path: 'edit/:topicId',
                        name: 'TopicEdit',
                        meta: {title: '编辑专栏', permissionCode: 'backend:topicManage:edit'},
                        component: () => import('../views/topic/TopicEdit.vue'),
                    },
                    {
                        path: 'add',
                        name: 'TopicAdd',
                        meta: {title: '新建专栏', permissionCode: 'backend:topicManage:add'},
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
                        meta: {title: '标签列表', permissionCode: 'backend:categoryManage:list'},
                        name: 'CategoryList',
                        component: () => import('../views/category/CategoryList.vue'),
                    },
                    {
                        path: 'add',
                        meta: {title: '新建标签', permissionCode: 'backend:categoryManage:add'},
                        name: 'CategoryAdd',
                        component: () => import('../views/category/CategoryEdit.vue'),
                    },
                    {
                        path: 'edit/:categoryId',
                        meta: {title: '编辑标签', permissionCode: 'backend:categoryManage:edit'},
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
                        meta: {title: '视图列表', permissionCode: 'backend:categoryViewManage:list'},
                    },
                    {
                        path: 'add',
                        name: 'CategoryViewAdd',
                        component: () => import('../views/category/CategoryViewEdit.vue'),
                        meta: {title: '新增视图', permissionCode: 'backend:categoryViewManage:add'},
                    },
                    {
                        path: 'edit/:viewId',
                        name: 'CategoryViewEdit',
                        component: () => import('../views/category/CategoryViewEdit.vue'),
                        meta: {title: '编辑视图', permissionCode: 'backend:categoryViewManage:edit'},
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
                        meta: {title: '内容列表', permissionCode: 'backend:contentManage:list'},
                    },
                    {
                        path: 'add',
                        name: 'ContentAdd',
                        component: () => import('../views/content/ContentEdit.vue'),
                        meta: {title: '新增内容', permissionCode: 'backend:contentManage:add'},
                    },
                    {
                        path: 'edit/:contentId',
                        name: 'ContentEdit',
                        component: () => import('../views/content/ContentEdit.vue'),
                        meta: {title: '编辑内容', permissionCode: 'backend:contentManage:edit'},
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
                        meta: {title: '日志列表', permissionCode: 'backend:updateLogManage:list'},
                    },
                    {
                        path: 'add',
                        name: 'UpdateLogAdd',
                        component: () => import('../views/updatelog/UpdateLogEdit.vue'),
                        meta: {title: '新增日志', permissionCode: 'backend:updateLogManage:add'},
                    },
                    {
                        path: 'edit/:logId',
                        name: 'UpdateLogEdit',
                        component: () => import('../views/updatelog/UpdateLogEdit.vue'),
                        meta: {title: '编辑日志', permissionCode: 'backend:updateLogManage:edit'},
                    }
                ]
            },
            {
                path: 'settings/friend-links',
                name: 'FriendshipLinkManage',
                component: () => import('../views/friendship-link/FriendshipLinkManage.vue'),
                meta: {title: '友链管理'},
                redirect: {name: 'FriendshipLinkList'},
                children: [
                    {
                        path: 'list',
                        name: 'FriendshipLinkList',
                        component: () => import('../views/friendship-link/FriendshipLinkList.vue'),
                        meta: {title: '友链列表', permissionCode: 'backend:friendshipLinkManage:list'},
                    },
                    {
                        path: 'add',
                        name: 'FriendshipLinkAdd',
                        component: () => import('../views/friendship-link/FriendshipLinkEdit.vue'),
                        meta: {title: '新增友链', permissionCode: 'backend:friendshipLinkManage:add'},
                    },
                    {
                        path: 'edit/:linkId',
                        name: 'FriendshipLinkEdit',
                        component: () => import('../views/friendship-link/FriendshipLinkEdit.vue'),
                        meta: {title: '编辑友链', permissionCode: 'backend:friendshipLinkManage:edit'},
                    }
                ]
            },
            ...systemSettingRoute,
            {
                path: 'error/:errorCode',
                name: 'Error',
                component: () => import('../views/common/Error.vue'),
                meta: {title: '出错了......', withoutPermissionCheck: true},
            }
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'UnKnown',
        redirect: {name: 'Error', params: {errorCode: 404}},

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

    if (!checkPermission(to)) {
        router.push({name: 'Error', params: {errorCode: 401}})
    }
})

function checkPermission(route: RouteLocationNormalizedGeneric): boolean {
    if (route.meta.withoutPermissionCheck) {
        return true
    }
    const mainStore = useMainStore()
    return mainStore.permissionCodeList.length === 0 || mainStore.permissionCodeList.includes(route.meta.permissionCode)
}

export default router