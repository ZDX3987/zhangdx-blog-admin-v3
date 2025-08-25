import {genApiResponse} from "../utils/api-util.ts";
import axios, {type ApiResponse} from "./axios.ts";
import type {MenuItem} from "../type/MenuItem.ts";

const url = '/api/menu'

export function getAdminMenu(): Promise<ApiResponse<MenuItem[]>> {
    let params = {
        menuType: 'ADMIN'
    }
    return genApiResponse(axios.get(url + '/list', {params}))
}