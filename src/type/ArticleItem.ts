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
    categories: CategoryItem[];
    extraData: ArticleExtraData
}

export class ArticleExtraData {
    previewConfig: PreviewConfig;

    constructor(previewConfig: PreviewConfig) {
        this.previewConfig = previewConfig
    }
}

export class PreviewConfig {
    vditorPreview: VditorPreview

    public setVditorPreview(preview: VditorPreview): PreviewConfig {
        this.vditorPreview = preview
        return this
    }
}

export interface VditorPreview {
    hlStyle: string;
}