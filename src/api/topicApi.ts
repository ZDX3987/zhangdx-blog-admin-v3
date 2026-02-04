import {genApiResponse} from "../utils/api-util.ts";
import axios, {type ApiResponse} from "./axios.ts";
import type {ResultPage} from "../type/ResultPage.ts";
import {TopicItem} from "../type/TopicItem.ts";

const url = '/api/topic'

export function getTopicPages(current: number, pageSize: number): Promise<ApiResponse<ResultPage<TopicItem>>> {
    let params = {
        currentPage: current,
        pageSize: pageSize
    }
    return genApiResponse(axios.get(url + '/topic-page', {params}))
}
