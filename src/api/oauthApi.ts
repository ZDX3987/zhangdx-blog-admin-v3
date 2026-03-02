import type {LoginForm} from "../type/LoginForm.ts";
import axios, {type ApiResponse} from "./axios.ts";
import {genApiResponse} from "../utils/api-util.ts";
import {AuthUserInfo} from "../type/AuthUserInfo.ts";

export function login(loginForm: LoginForm): Promise<ApiResponse<void>> {
    return genApiResponse(axios.post('/api/login', loginForm))
}

export function getCurrUser(): Promise<ApiResponse<AuthUserInfo>> {
    return genApiResponse(axios.get('/api/user/curruser'))
}

export function logout() {
    return genApiResponse(axios.get('/api/logout'))
}