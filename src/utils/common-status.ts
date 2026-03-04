export const articleStatus = {
    "SAVED": {name: "已保存", value: 0, color: ""},
    "TO_BE_REVIEWED": {name: "待审核", value: 1, color: "warning"},
    "PUBLISHED": {name: "已发布", value: 2, color: "success"},
    "DELETED": {name: "已删除", value: 3, color: "danger"}
}

export enum ArticleStatusEnum {
    SAVED = 'SAVED',
    TO_BE_REVIEWED = 'TO_BE_REVIEWED',
    PUBLISHED = 'PUBLISHED',
    DELETED = 'DELETED'
}