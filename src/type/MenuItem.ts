export class MenuItem {
    id: number;
    text: string;
    componentName: string;
    router: string;
    iconClass: string;
    childrenMenu: MenuItem[];
    status: number
    parentMenu: MenuItem | undefined;
}