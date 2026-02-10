export class MenuItem {
    id: number;
    text: string;
    componentName: string;
    router: string;
    iconClass: string;
    childrenMenu: MenuItem[];
    status: number | undefined;
    parentMenu: MenuItem | undefined;
    parentId: number | undefined;
    seqNum: number;
    level: number;
    type: number;
}