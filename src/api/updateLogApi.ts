import axios, {type ApiResponse} from "./axios.ts";
import {genApiResponse} from "../utils/api-util.ts";
import type {ResultPage} from "../type/ResultPage.ts";
import {UpdateLog} from "../type/UpdateLog.ts";

const url = '/api/update-log'

export function getUpdateLogPage(currentPage: number, pageSize: number): Promise<ApiResponse<ResultPage<UpdateLog>>> {
    let params = {
        currentPage,
        pageSize,
        status: [1,2,3]
    }
    return genApiResponse(axios.get(url + '/page', {params:params}));
}
