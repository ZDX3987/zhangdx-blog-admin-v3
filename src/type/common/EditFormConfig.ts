import type {ApiResponse} from "../../api/axios.ts";
import type {FormItemRule} from "element-plus";

export class EditFormItem {
    label: string;
    model: string;
    placeholder: string;
    type: FormItemType;
    width: number;
    options: FormOption[];
    switchValue: number[];
    rules: FormItemRule[] = [];


    public static defineInputItem(label: string, model: string, width?: number, placeholder?: string): EditFormItem {
        const item = new EditFormItem()
        item.type = FormItemType.Input
        item.label = label
        item.model = model
        item.width = width || 100
        item.placeholder = placeholder || ''
        return item
    }

    public static defineSelectItem(label: string, model: string, options: FormOption[]): EditFormItem {
        const item = new EditFormItem()
        item.type = FormItemType.Select
        item.label = label
        item.model = model
        item.options = options
        return item
    }

    public static defineSwitchItem(label: string, model: string): EditFormItem {
        const item = new EditFormItem()
        item.type = FormItemType.Switch
        item.label = label
        item.model = model
        item.switchValue = [0,1]
        return item
    }


    public setPlaceholder(placeholder: string): EditFormItem {
        this.placeholder = placeholder
        return this
    }

    public setWidth(width: number): EditFormItem {
        this.width = width
        return this
    }

    public addRule(...rules: FormItemRule[]): EditFormItem {
        this.rules.push(...rules)
        return this
    }
}

export class SubmitConfig {
    btnText: string;
    submitFunc: (formValue: any) => Promise<ApiResponse<any>>;
    type: string;

    public constructor(btnText?: string, submitFunc: Function) {
        this.btnText = btnText || '提交'
        this.type = 'primary'
        this.submitFunc = submitFunc
    }
}

export class EditFormConfig {
    formItems: EditFormItem[];
    submitConfig: SubmitConfig;
    resettable: boolean;
    formValue: any;
    wrapperWidthPercent: number;
    validatable: boolean;
    rules: any;

    public constructor() {
        this.formItems = []
        this.submitConfig = new SubmitConfig()
        this.resettable = true
        this.wrapperWidthPercent = 50
    }

    public openValidate(): EditFormConfig {
        this.validatable = true
        let ruleObj: any = {}
        this.formItems.forEach(item => ruleObj[item.model] = item.rules)
        this.rules = ruleObj
        return this
    }

}

export enum FormItemType {
    Password, Input, Checkbox,  Radio, Select, Switch, Button,  Upload,  InputNumber, InputTag,
    DatePicker, DateTimePicker,
}

export class FormOption {
    label: string;
    value: any;
    key: any;

    public constructor(label: string, value: any, key?: any) {
        this.label = label
        this.value = value
        this.key = key || value
    }
}