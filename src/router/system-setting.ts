export  default [
    {
        path: 'settings/sys-user',
        name: 'SysUserManage',
        component: () => import('../views/sysuser/SysUserManage.vue'),
        meta: {title: '系统用户管理'},
        redirect: {name: 'SysUserList'},
        children: [
            {
                path: 'list',
                name: 'SysUserList',
                component: () => import('../views/sysuser/SysUserList.vue'),
                meta: {title: '用户列表', permissionCode: 'backend:systemUserManage:list'},
            },
            {
                path: 'edit/:sysUserId',
                name: 'SysUserEdit',
                component: () => import('../views/sysuser/SysUserEdit.vue'),
                meta: {title: '编辑用户', permissionCode: 'backend:systemUserManage:edit'},
            },
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
                meta: {title: '权限列表', permissionCode: 'backend:permissionManage:list'},
            },
            {
                path: 'edit/:permissionId',
                name: 'PermissionEdit',
                component: () => import('../views/permission/PermissionEdit.vue'),
                meta: {title: '编辑权限', permissionCode: 'backend:permissionManage:edit'},
            },
            {
                path: 'add',
                name: 'PermissionAdd',
                component: () => import('../views/permission/PermissionEdit.vue'),
                meta: {title: '新增权限', permissionCode: 'backend:permissionManage:add'},
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
                meta: {title: '权限列表', permissionCode: 'backend:roleManage:list'},
            },
            {
                path: 'edit/:roleId',
                name: 'UserRoleEdit',
                component: () => import('../views/userrole/UserRoleEdit.vue'),
                meta: {title: '编辑角色', permissionCode: 'backend:roleManage:edit'},
            },
            {
                path: 'add',
                name: 'UserRoleAdd',
                component: () => import('../views/userrole/UserRoleEdit.vue'),
                meta: {title: '新增角色', permissionCode: 'backend:roleManage:add'},
            }
        ]
    },
    {
        path: 'settings/menu',
        name: 'MenuManage',
        component: () => import('../views/menu/MenuManage.vue'),
        meta: {title: '菜单管理'},
        redirect: {name: 'MenuTree'},
        children: [
            {
                path: 'tree',
                name: 'MenuTree',
                component: () => import('../views/menu/MenuTree.vue'),
                meta: {title: '菜单列表', permissionCode: 'backend:menuManage:tree'},
            }
        ]
    }
]