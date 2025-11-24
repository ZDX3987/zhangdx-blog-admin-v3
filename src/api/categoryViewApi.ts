import axios, {type ApiResponse} from "./axios.ts";
import type {ResultPage} from "../type/ResultPage.ts";
import {genApiResponse} from "../utils/api-util.ts";
import {CategoryItem} from "../type/CategoryItem.ts";
import type {CategoryViewConfig} from "../type/CategoryViewConfig.ts";

const url = '/api/category-view-config'

export function getAllCategoryView(): Promise<ApiResponse<CategoryViewConfig[]>> {
    return genApiResponse(axios.get(url + '/list'));
}

export function editCategoryView(categoryViewConfig: CategoryViewConfig): Promise<ApiResponse<any>> {
    console.log(categoryViewConfig)
    return genApiResponse(axios.post(url + '/save', categoryViewConfig));
}