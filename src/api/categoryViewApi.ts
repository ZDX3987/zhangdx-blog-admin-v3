import axios, {type ApiResponse} from "./axios.ts";
import {genApiResponse} from "../utils/api-util.ts";
import type {CategoryViewConfig} from "../type/CategoryViewConfig.ts";

const url = '/api/category-view-config'

export function getAllCategoryView(): Promise<ApiResponse<CategoryViewConfig[]>> {
    return genApiResponse(axios.get(url + '/list'));
}

export function editCategoryView(categoryViewConfig: CategoryViewConfig): Promise<ApiResponse<any>> {
    return genApiResponse(axios.post(url + '/save', categoryViewConfig));
}