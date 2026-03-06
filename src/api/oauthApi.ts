import type {LoginForm} from "../type/LoginForm.ts";
import axios, {type ApiResponse} from "./axios.ts";
import {genApiResponse} from "../utils/api-util.ts";
import {AuthUserInfo} from "../type/AuthUserInfo.ts";
import type {SocialLoginTypeEnum} from "../type/common/social-login-type.ts";

export function login(loginForm: LoginForm): Promise<ApiResponse<void>> {
    return genApiResponse(axios.post('/api/login', loginForm))
}

export function getCurrUser(): Promise<ApiResponse<AuthUserInfo>> {
    return genApiResponse(axios.get('/api/user/curruser'))
}

export function logout() {
    return genApiResponse(axios.get('/api/logout'))
}

export function socialLogin(type: SocialLoginTypeEnum, method: string, sysUserId: number): Promise<ApiResponse<string>> {
    const params = {
        method: method,
        sysUserId: sysUserId
    }
    return genApiResponse(axios.get('/api/client/oauth/login/' + type, {params}))
}

export function realLogin(username: string): Promise<ApiResponse<any>> {
    const params = {
        username
    }
    return genApiResponse(axios.post('/api/client/oauth/social-login', params))
}