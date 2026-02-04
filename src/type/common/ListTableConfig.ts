import type {ApiResponse} from "../../api/axios.ts";
import type {ResultPage} from "../ResultPage.ts";
import {ElMessage} from "element-plus";

export class ListTableDataMapping {
    prop: string;
    label: string;
    width: number;
    isIndex: boolean;
    isSelection: boolean;
    type: string = 'default';
    datePattern: string;
    isDate: boolean;
    slotTemplates: SlotType;
    align: string;
    fixed: string;


    public static defineIndexColumn(label?: string, width?: number): ListTableDataMapping {
        let mapping = new ListTableDataMapping()
        mapping.isIndex = true
        mapping.label = label || '序号'
        mapping.width = width || 80
        mapping.align = 'center'
        mapping.type = 'index'
        return mapping
    }

    public static defineSelectionColumn(): ListTableDataMapping {
        let mapping = new ListTableDataMapping()
        mapping.isSelection = true
        mapping.type = 'selection'
        return mapping
    }

    public static defineCommonColumn(prop: string, label: string, width?: number, align?: string): ListTableDataMapping {
        let mapping = new ListTableDataMapping()
        mapping.prop = prop
        mapping.label = label
        mapping.width = width || 120
        mapping.align = align || 'center'
        return mapping
    }

    public static defineDateColumn(prop: string, label: string, width?: number, datePattern?: string): ListTableDataMapping {
        let mapping = new ListTableDataMapping()
        mapping.prop = prop
        mapping.label = label
        mapping.width = width || 120
        mapping.isDate = true
        mapping.datePattern = datePattern || 'yyyy-MM-DD HH:mm:ss'
        mapping.align = 'center'
        return mapping
    }

    public static defineRightOperator(label: string, align?: string): ListTableDataMapping {
        let mapping = new ListTableDataMapping()
        mapping.label = label
        mapping.fixed = 'right'
        mapping.align = align || 'center'
        return mapping
    }

    public addSlotTemplate(defaultName: string, headerName?: string): ListTableDataMapping {
        this.slotTemplates = new SlotType(defaultName, headerName)
        return this
    }

}

class SlotType {
    default: string;
    header: string;

    constructor(defaultName: string, headerName: string) {
        this.default = defaultName
        this.header = headerName
    }
}

export class DeleteConfig {
    deleteFunc: (id: number) => Promise<ApiResponse<any>>;
    delBtnText: string = '删除';
    delConfirmText: string = '确定删除吗？';

    constructor(deleteFunc: Function, delBtnText?: string, delConfirmText?: string) {
        this.deleteFunc = (id) => {
            if (deleteFunc) {
                return deleteFunc(id)
            } else {
                return Promise.reject('删除功能未实现');
            }
        }
        if (delBtnText) {
            this.delBtnText = delBtnText
        }
        if (delConfirmText) {
            this.delConfirmText = delConfirmText
        }
    }
}

export class EditConfig {
    editFunc: (id: number) => void;

    constructor(editFunc?: Function) {
        this.editFunc = (id) => {
            if (editFunc) {
                editFunc(id)
            } else {
                throw new Error('编辑功能未实现')
            }
        }
    }
}

export class PagerConfig {
    pageSizes: number[];
    layout: string[];
    defaultPageSize: number = 15;

    constructor() {
        this.pageSizes = [5, 10, 15, 30, 50, 100]
        this.layout = ['total', 'prev', 'pager', 'next', 'sizes', 'jumper']
    }

}

export class QueryConfig {
    queryFunc: (currentPage: number, pageSize: number) => Promise<ApiResponse<ResultPage<any>>>;
}

export class AddConfig {
    showAddBtn: boolean;
    addBtnText: string;
    addFunc: () => void;

    constructor(addBtnText?: string, addFunc: Function) {
        this.showAddBtn = true
        this.addBtnText = addBtnText
        this.addFunc = addFunc
    }
}

export class ListTableConfig {
    deleteConfig: DeleteConfig;
    pagerConfig: PagerConfig;
    editConfig: EditConfig;
    tableMappings: ListTableDataMapping[] = [];
    queryConfig: QueryConfig;
    addConfig: AddConfig;
    tableData: any[] | undefined;

    public constructor() {
        this.tableMappings = []
        this.pagerConfig = new PagerConfig()
        this.queryConfig = new QueryConfig()
    }

    public needShowOperator(): boolean {
        return this.deleteConfig !== undefined || this.editConfig !== undefined
    }

    public isLocalDataSource(): boolean {
        return this.tableData
    }
}