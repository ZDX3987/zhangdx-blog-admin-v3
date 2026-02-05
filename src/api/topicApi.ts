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

export function getTopicItem(topicId: number): Promise<ApiResponse<TopicItem>> {
    return genApiResponse(axios.get(url + '/topic/' + topicId))
}

export function saveTopicItem(topicForm: TopicItem): Promise<ApiResponse<any>> {
    return genApiResponse(axios.post(url + '/topic', topicForm))
}

export function deleteTopicItem(topicId: number): Promise<ApiResponse<any>> {
    let params = {
        topicId
    }
    return genApiResponse(axios.delete(url + '/topic', {params}))
}
