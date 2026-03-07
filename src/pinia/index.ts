import {defineStore} from "pinia";
import type {AuthUserInfo} from "../type/AuthUserInfo.ts";
import {getAuthPermission} from "../api/permissionApi.ts";

export const useMainStore = defineStore('mainStore', {
    state: () => ({
        authUserInfo: null as AuthUserInfo | null,
        permissionCodeList: [] as string[],
        permissionCodeLoaded: false as boolean,
    }),
    actions: {
        updateAuthUserInfo(userInfo: AuthUserInfo | null) {
            this.authUserInfo = userInfo
        },
        async loadPermissionCodeList() {
            const res = await getAuthPermission(2)
            this.permissionCodeList = res.data.map(item => item.permissionCode)
            this.permissionCodeLoaded = true
        }
    }
})