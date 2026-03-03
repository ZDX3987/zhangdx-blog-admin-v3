import {defineStore} from "pinia";
import type {AuthUserInfo} from "../type/AuthUserInfo.ts";

export const useMainStore = defineStore('mainStore', {
    state: () => ({
        authUserInfo: null as AuthUserInfo | null,
        authRouteList: [] as string[]
    }),
    actions: {
        updateAuthUserInfo(userInfo: AuthUserInfo | null) {
            this.authUserInfo = userInfo
        },
        setAuthRouteList(routeList: string[]) {
            this.authRouteList = routeList
        }
    }
})