import axios, {type ApiResponse} from "./axios.ts";
import {genApiResponse} from "../utils/api-util.ts";
import type {ResultPage} from "../type/ResultPage.ts";
import {FriendshipLinkItem} from "../type/FriendshipLinkItem.ts";

const url = '/api/friendship-link'

export function getFriendshipLinkPage(currentPage: number, pageSize: number): Promise<ApiResponse<ResultPage<FriendshipLinkItem>>> {
    let params = {
        pageIndex: currentPage,
        pageSize
    }
    return genApiResponse(axios.get(url + '/page', {params:params}));
}

export function deleteFriendshipLink(linkId: number): Promise<ApiResponse<any>> {
    let params = {
        linkId
    }
    return genApiResponse(axios.delete(url, {params:params}));
}

export function getFriendshipLinkItem(linkId: number): Promise<ApiResponse<FriendshipLinkItem>> {
    let params = {
        linkId
    }
    return genApiResponse(axios.get(url, {params:params}));
}

export function saveFriendshipLinkItem(linkItem: FriendshipLinkItem): Promise<ApiResponse<FriendshipLinkItem>> {
    return genApiResponse(axios.post(url, linkItem));
}