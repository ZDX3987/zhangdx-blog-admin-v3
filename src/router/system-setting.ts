export  default [
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
            },
            {
                path: 'edit/:permissionId',
                name: 'PermissionEdit',
                component: () => import('../views/permission/PermissionEdit.vue'),
                meta: {title: '编辑权限'},
            },
            {
                path: 'add',
                name: 'PermissionAdd',
                component: () => import('../views/permission/PermissionEdit.vue'),
                meta: {title: '新增权限'},
            }
        ]
    },
    {
        path: 'userRoleManage',
        name: 'UserRoleManage',
        component: () => import('../views/userrole/UserRoleManage.vue'),
        meta: {title: '用户角色管理'},
        redirect: {name: 'UserRoleList'},
        children: [
            {
                path: 'list',
                name: 'UserRoleList',
                component: () => import('../views/userrole/UserRoleList.vue'),
                meta: {title: '权限列表'},
            },
            {
                path: 'edit/:roleId',
                name: 'UserRoleEdit',
                component: () => import('../views/userrole/UserRoleEdit.vue'),
                meta: {title: '编辑角色'},
            },
            {
                path: 'add',
                name: 'UserRoleAdd',
                component: () => import('../views/userrole/UserRoleEdit.vue'),
                meta: {title: '新增角色'},
            }
        ]
    },
]