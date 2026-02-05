import axios, {type ApiResponse} from "./axios.ts";
import {genApiResponse} from "../utils/api-util.ts";
import type {CategoryViewConfig} from "../type/CategoryViewConfig.ts";
import type {ResultPage} from "../type/ResultPage.ts";

const url = '/api/category-view-config'

export function getAllCategoryView(current: number, pageSize: number): Promise<ApiResponse<ResultPage<CategoryViewConfig>>> {
    let params = {
        current: current,
        pageSize: pageSize
    }
    return genApiResponse(axios.get(url + '/page', {params}));
}

export function getCategoryViewItem(viewId: number): Promise<ApiResponse<CategoryViewConfig>> {
    let params = {
        viewId
    }
    return genApiResponse(axios.get(url, {params}));
}

export function editCategoryView(categoryViewConfig: CategoryViewConfig): Promise<ApiResponse<any>> {
    return genApiResponse(axios.post(url + '/save', categoryViewConfig));
}

export function deleteCategoryView(viewId: number): Promise<ApiResponse<any>> {
    let params = {
        viewId
    }
    return genApiResponse(axios.delete(url, {params}));
}