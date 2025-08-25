import type {LoginForm} from "../type/LoginForm.ts";
import axios, {type ApiResponse} from "./axios.ts";
import {genApiResponse} from "../utils/api-util.ts";

export function login(loginForm: LoginForm): Promise<ApiResponse<void>> {
    return genApiResponse(axios.post('/api/login', loginForm))
}