import type {ApiResponse} from "../api/axios.ts";
import type {AxiosResponse} from "axios";

export async function genApiResponse(promise: Promise<AxiosResponse<ApiResponse<any>>>): Promise<ApiResponse<any>> {
    try {
        let promiseResult = await promise
        return promiseResult.data
    } catch (error: any | string) {
        let errorMsg: string
        if ('string' === typeof error) {
            errorMsg = error
        } else {
            errorMsg = error.msg || error.message
        }
        return Promise.reject(errorMsg)
    }
}

export async function genData<T>(promise: Promise<ApiResponse<T>>): Promise<T> {
    let apiResponse: ApiResponse<T> = await promise
    return apiResponse.data
}