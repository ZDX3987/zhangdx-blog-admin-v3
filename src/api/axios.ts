import axios, {type AxiosResponse} from 'axios'
import {getAuthorization, setAuthorization} from "../utils/auth-storage.ts";
import {ElMessage} from 'element-plus'
import Router from '../router/index.ts'

const service = axios.create({
    baseURL: '',
    timeout: 15000
})

service.interceptors.request.use(request => {
    const token: string | null = getAuthorization()
    token && (request.headers.Authorization = token)
    return request
}, error => {
        return Promise.reject(error);
})

service.interceptors.response.use((response: AxiosResponse<ApiResponse<any>>) => {
    let data: ApiResponse<any> = response.data;
    processCommonResponseCode(data)
    storageToken(response)
    if (data.code !== 200) {
        return Promise.reject(data)
    }
    return response
}, error => {
    let resp = error.response;
    errorHandle(resp);
    return Promise.reject(error);
})

export interface ApiResponse<T> {
    code: number;
    msg: string;
    data: T
}

function processCommonResponseCode(responseData: ApiResponse<any>) {
    const code = responseData.code;
    switch (code) {
        case 404:
            ElMessage.error(responseData.msg)
            Router.push('/error');
            break;
        case 401:
            ElMessage.error(responseData.msg)
            Router.push('/login')
            break
        default:
            break;
    }
}

function storageToken(response: AxiosResponse<any>) {
    if (response.config.url === '/api/login') {
        let token = response.headers.authorization;
        if (token) {
            setAuthorization(token)
        }
    }
}

function errorHandle(response: AxiosResponse<any>) {
    let status = response.status;
    if (status === 500) {
        let data: ApiResponse<any> = response.data;
        if (data && data.msg !== null) {
            ElMessage.error(data.msg)
        } else {
            ElMessage.error('系统出现错误，请联系管理员')
        }
        return;
    }
    switch (status) {
        case 401:
            Router.push({name: 'Login'});
            break;
        default:
            Router.push('/error');
            break;
    }
}

export default service