import {genApiResponse} from "../utils/api-util.ts";
import axios, {type ApiResponse} from "./axios.ts";
import type {ResultPage} from "../type/ResultPage.ts";
import {Role} from "../type/Role.ts";

const url = '/api/role'

export function getRolePages(current: number, pageSize: number): Promise<ApiResponse<ResultPage<Role>>> {
    let params = {
        current: current,
        pageSize: pageSize
    }
    return genApiResponse(axios.get(url + '/pages', {params}))
}

export function deleteRole(roleId: number): Promise<ApiResponse<any>> {
    let params = {
        roleId: roleId
    }
    return genApiResponse(axios.delete(url, {params}))
}

export function getRoleItem(roleId: number): Promise<ApiResponse<Role>> {
    let params = {
        roleId: roleId
    }
    return genApiResponse(axios.get(url, {params}))
}

export function doSaveRole(roleForm: Role): Promise<ApiResponse<any>> {
    return genApiResponse(axios.post(url, roleForm))
}