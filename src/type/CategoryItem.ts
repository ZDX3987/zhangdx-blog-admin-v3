export class CategoryItem {
    id: number;
    cateName: string;
    articleCount: number;
    parentCate: CategoryItem | null;
    status: number;

    children: CategoryItem[] | null;
}