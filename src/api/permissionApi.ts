import {genApiResponse} from "../utils/api-util.ts";
import axios, {type ApiResponse} from "./axios.ts";
import type {ResultPage} from "../type/ResultPage.ts";
import {Permission} from "../type/Permission.ts";
import {PermissionForm} from "../type/PermissionForm.ts";

const url = '/api/permission'

export function getPermissionPages(current: number, pageSize: number): Promise<ApiResponse<ResultPage<Permission>>> {
    let params = {
        current: current,
        pageSize: pageSize
    }
    return genApiResponse(axios.get(url + '/pages', {params}))
}

export function deletePermission(permissionId: number): Promise<ApiResponse<any>> {
    let params = {
        permissionId: permissionId
    }
    return genApiResponse(axios.delete(url, {params}))
}

export function getPermission(permissionId: number): Promise<ApiResponse<PermissionForm>> {
    let params = {
        permissionId: permissionId
    }
    return genApiResponse(axios.get(url, {params}))
}

export function doSavePermission(permissionForm: PermissionForm): Promise<ApiResponse<any>> {
    return genApiResponse(axios.post(url, permissionForm))
}