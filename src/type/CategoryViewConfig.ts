export class CategoryViewConfig {
    id: number;
    name: string;
    status: number;
    itemList: CategoryViewConfigItem[]
    categoryIds: number[]
}

type CategoryViewConfigItem = {
    categoryId: number;
    categoryName: string;
}