import {genApiResponse} from "../utils/api-util.ts";
import axios, {type ApiResponse} from "./axios.ts";
import type {MenuItem} from "../type/MenuItem.ts";

const url = '/api/menu'

export function getAdminMenu(): Promise<ApiResponse<MenuItem[]>> {
    let params = {
        menuType: 'ADMIN'
    }
    return genApiResponse(axios.get(url + '/role-menu', {params}))
}

export function getMenuListByType(menuType: string): Promise<ApiResponse<MenuItem[]>> {
    let params = {
        menuType
    }
    return genApiResponse(axios.get(url + '/list', {params}))
}

export function sortMenuList(menuList: MenuItem[]): Promise<ApiResponse<any>> {
    return genApiResponse(axios.put(url + '/sort', menuList))
}