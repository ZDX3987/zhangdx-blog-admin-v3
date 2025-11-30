import axios, {type ApiResponse} from "./axios.ts";
import {genApiResponse} from "../utils/api-util.ts";
import type {ResultPage} from "../type/ResultPage.ts";
import {UpdateLog} from "../type/UpdateLog.ts";

const url = '/api/update-log'

export function getUpdateLogPage(currentPage: number, pageSize: number): Promise<ApiResponse<ResultPage<UpdateLog>>> {
    let params = {
        currentPage,
        pageSize,
        status: [0,1,2,3]
    }
    return genApiResponse(axios.get(url + '/page', {params:params}));
}

export function deleteUpdateLog(id: number): Promise<ApiResponse<any>> {
    return genApiResponse(axios.delete(url + '/update-log/' + id))
}

export function getUpdateLogById(logId: number): Promise<ApiResponse<UpdateLog>> {
    return genApiResponse(axios.get(url, {params:{logId}}));
}

export function saveUpdateLog(updateLog: UpdateLog): Promise<ApiResponse<any>> {
    return genApiResponse(axios.post(url + '/update-log', updateLog));
}