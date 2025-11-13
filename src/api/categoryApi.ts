import axios, {type ApiResponse} from "./axios.ts";
import type {ResultPage} from "../type/ResultPage.ts";
import {genApiResponse} from "../utils/api-util.ts";
import {CategoryItem} from "../type/CategoryItem.ts";

const url = '/api/category'

export function getAllCategory(pageSize: number, current: number): Promise<ApiResponse<ResultPage<CategoryItem>>> {
    let params = {
        current: current,
        pageSize: pageSize
    }
    return genApiResponse(axios.get(url + '/category-page', {params: params}));
}

export function updateCategory(category: CategoryItem): Promise<ApiResponse<any>> {
    return genApiResponse(axios.put(url + '/category', category));
}

export function delCategory(cateId: number): Promise<ApiResponse<any>> {
    return genApiResponse(axios.delete(url + '/category/' + cateId));
}