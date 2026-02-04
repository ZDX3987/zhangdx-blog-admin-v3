import type {ArticleItem} from "./ArticleItem.ts";

export class TopicItem {
    id: number;
    title: string;
    createDate: Date;
    updateDate: Date;
    coverImg: string;
    praise: number;
    commentCount: number;
    readCount: number;
    articleCount: number;
    articleVOList: ArticleItem[];
}