import {genApiResponse} from "../utils/api-util.ts";
import axios, {type ApiResponse} from "./axios.ts";
import type {ResultPage} from "../type/ResultPage.ts";
import {SysUser} from "../type/SysUser.ts";

const url = '/api/user'

export function getSysUserPages(current: number, pageSize: number): Promise<ApiResponse<ResultPage<SysUser>>> {
    let params = {
        currentPage: current,
        pageSize: pageSize
    }
    return genApiResponse(axios.get(url + '/sys-user-page', {params}))
}

export function deleteRole(roleId: number): Promise<ApiResponse<any>> {
    let params = {
        roleId: roleId
    }
    return genApiResponse(axios.delete(url, {params}))
}

export function getUserInfo(sysUserId: number): Promise<ApiResponse<SysUser>> {
    let params = {
        sysUserId: sysUserId
    }
    return genApiResponse(axios.get(url + '/user-info', {params}))
}

export function doSaveRole(roleForm: SysUser): Promise<ApiResponse<any>> {
    return genApiResponse(axios.post(url, roleForm))
}

export function disableUser(sysUserId: number, disabled: boolean): Promise<ApiResponse<any>> {
    let from = {
        sysUserId: sysUserId,
        disabled: disabled
    }
    return genApiResponse(axios.post(url + '/convert-status', from))
}