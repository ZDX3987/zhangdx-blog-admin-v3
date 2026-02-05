import axios, {type ApiResponse} from "./axios.ts";
import {genApiResponse} from "../utils/api-util.ts";
import type {ResultPage} from "../type/ResultPage.ts";
import type {ContentItem} from "../type/ContentItem.ts";

const url = '/api/content'

export function getContentPage(currentPage: number, pageSize: number): Promise<ApiResponse<ResultPage<ContentItem>>> {
    let params = {
        pageIndex: currentPage,
        pageSize
    }
    return genApiResponse(axios.get(url + '/page', {params:params}));
}

export function saveOrUpdateContent(contentForm: ContentItem): Promise<ApiResponse<any>> {
    return genApiResponse(axios.post(url, contentForm));
}

export function deleteContentApi(contentId: number): Promise<ApiResponse<any>> {
    return genApiResponse(axios.delete(url + '/' + contentId));
}

export function getContentById(contentId: number): Promise<ApiResponse<ContentItem>> {
    return genApiResponse(axios.get(url + '/' + contentId));
}