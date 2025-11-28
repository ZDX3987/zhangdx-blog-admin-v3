import {genApiResponse} from "../utils/api-util.ts";
import axios, {type ApiResponse} from "./axios.ts";
import type {ResultPage} from "../type/ResultPage.ts";
import {Permission} from "../type/Permission.ts";

const url = '/api/permission'

export function getPermissionPages(current: number, pageSize: number): Promise<ApiResponse<ResultPage<Permission>>> {
    let params = {
        current: current,
        pageSize: pageSize
    }
    return genApiResponse(axios.get(url + '/pages', {params}))
}