import type {Author} from "./Author.ts";
import type {CategoryItem} from "./CategoryItem.ts";

export class ArticleItem {
    id: number;
    articleId: string;
    title: string;
    text: string;
    digest: string;
    status: string;
    source: number;
    publishDate: Date;
    updateDate: Date;
    createDate: Date;
    articleType: string;
    authorId: number;
    coverImg: string;
    praise: number;
    readCount: number;
    commentCount: number;
    author: Author;
    categories: CategoryItem[]

}