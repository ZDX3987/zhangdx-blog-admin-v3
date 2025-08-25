import axios, {type ApiResponse} from "./axios.ts";
import type {ResultPage} from "../type/ResultPage.ts";
import {genApiResponse} from "../utils/api-util.ts";

const url = '/api/article'

export function getArticlePage(pageSize: number, pageIndex: number, queryStatus: number[], sort: number, queryDate: string[]): Promise<ApiResponse<ResultPage<any>>> {
    let formData = new FormData();
    pageIndex--
    formData.append("pageSize", pageSize.toString());
    formData.append("pageIndex", pageIndex.toString());
    formData.append("status", queryStatus.toString());
    formData.append("sortType", sort.toString());
    formData.append("queryType", "1");
    if (queryDate) {
        formData.append("startDate", queryDate[0] + ' 00:00:00');
        formData.append("endDate", queryDate[1] + ' 23:59:59');
    }
    return genApiResponse(axios.post(url + '/articles', formData));
}

export function delArticle(articleId: number) {
    return axios.delete(url + '/article/' + articleId);
}

export function download(articleId: number) {
    return axios.get(url + '/download/' + articleId, {
        responseType: 'blob'
    });
}