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

export function saveMenu(menuItem: MenuItem): Promise<ApiResponse<any>> {
    return genApiResponse(axios.post(url, menuItem))
}

export function getMenuItemInfo(menuId: number): Promise<ApiResponse<MenuItem>> {
    let params = {
        menuId
    }
    return genApiResponse(axios.get(url + '/item-info', {params}))
}

export function deleteMenuItem(menuId: number): Promise<ApiResponse<any>> {
    let params = {
        delMenuId: menuId
    }
    return genApiResponse(axios.delete(url, {params}))
}