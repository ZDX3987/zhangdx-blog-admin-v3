export class CategoryItem {
    id: number;
    cateName: string;
    articleCount: number;
    parentCate: CategoryItem | undefined;
    status: number;
    parentId: number;
    children: CategoryItem[] | undefined;
}