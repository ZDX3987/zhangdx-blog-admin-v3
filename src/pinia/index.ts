import {defineStore} from "pinia";
import type {AuthUserInfo} from "../type/AuthUserInfo.ts";

export const useMainStore = defineStore('mainStore', {
    state: () => ({
        authUserInfo: null as AuthUserInfo | null,
    }),
    actions: {
        updateAuthUserInfo(userInfo: AuthUserInfo | null) {
            this.authUserInfo = userInfo
        },
    }
})