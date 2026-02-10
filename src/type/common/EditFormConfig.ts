import type {ApiResponse} from "../../api/axios.ts";
import type {FormItemRule} from "element-plus";

export class EditFormItem {
    label: string = '';
    model: string = '';
    placeholder: string = '';
    type: FormItemType = FormItemType.Input;
    width: number | undefined;
    rules: FormItemRule[] = [];
    disabled: boolean = false;


    public static defineInputItem(label: string, model: string, width?: number, placeholder?: string): EditFormItem {
        const item = new EditFormItem()
        item.type = FormItemType.Input
        item.label = label
        item.model = model
        item.width = width || 100
        item.placeholder = placeholder || ''
        return item
    }

    public static defineSelectItem(label: string, model: string, options: FormOption[], remoteFunc?: (keyword: string) => Promise<FormOption[]>, isMultiple?: boolean): EditFormItem {
        const item = new SelectFormItem()
        item.label = label
        item.model = model
        if (options && options.length > 0) {
            item.options = options
        } else if (remoteFunc) {
            item.remoteFunc = remoteFunc
            item.isRemoteMode = true
        }
        item.multiple = !!isMultiple
        return item
    }

    public static defineSwitchItem(label: string, model: string): EditFormItem {
        const item = new SwitchFormItem()
        item.label = label
        item.model = model
        return item
    }

    public static defineTransferItem(label: string, data: any[], model: string, title?: string[], buttonText?: string[]): TransferFormItem {
        const item = new TransferFormItem()
        item.label = label
        item.data = data
        item.model = model
        if (title) {
            item.title = title
        }
        if (buttonText) {
            item.buttonText = buttonText
        }
        return item
    }

    public static defineUploadItem(label: string, model: string): EditFormItem {
        const item = new UploadFormItem()
        item.label = label
        item.model = model
        return item
    }

    public static defineSlotItem(label: string, slotName: string): EditFormItem {
        const item = new SlotFormItem()
        item.label = label
        item.slot = new SlotType(slotName)
        return item
    }

    public static defineTextarea(label: string, model: string, width?: number, placeholder?: string): EditFormItem {
        const item = new EditFormItem()
        item.type = FormItemType.Textarea
        item.label = label
        item.model = model
        item.width = width || 100
        item.placeholder = placeholder || ''
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
    public setDisabled(disabled: boolean): EditFormItem {
        this.disabled = disabled
        return this
    }

    public addRule(...rules: FormItemRule[]): EditFormItem {
        this.rules.push(...rules)
        return this
    }

    public isSelect(): this is SelectFormItem {
        return this.type === FormItemType.Select && (this instanceof SelectFormItem)
    }
    public isSwitch(): this is SwitchFormItem {
        return this.type === FormItemType.Switch && (this instanceof SwitchFormItem)
    }
    public isTransfer(): this is TransferFormItem {
        return this.type === FormItemType.Transfer && (this instanceof TransferFormItem)
    }

    public isUpload(): this is UploadFormItem {
        return this.type === FormItemType.Upload && (this instanceof UploadFormItem)
    }

    public isSlot(): this is SlotFormItem {
        return this.type === FormItemType.Slot && (this instanceof SlotFormItem)
    }
}
class SelectFormItem extends EditFormItem {
    options: FormOption[] = [];
    remoteFunc: (keyword: string) => Promise<FormOption[]>;
    isRemoteMode: boolean = false;
    multiple: boolean = false;
    constructor() {
        super();
        this.type = FormItemType.Select
        this.remoteFunc = () => Promise.reject([])
    }

    public selectRemoteSearch(queryName: string) {
        if (this.remoteFunc) {
            this.remoteFunc(queryName).then(res => this.options = res || [])
                .catch(() => this.options = [])
        }
    }

    public setMultiple(isMultiple: boolean): SelectFormItem {
        this.multiple = isMultiple
        return this
    }
}
class SwitchFormItem extends EditFormItem {
    switchValue: number[] = [0,1];
    constructor() {
        super();
        this.type = FormItemType.Switch
    }
}
class TransferFormItem extends EditFormItem {
    data: any[] = [];
    title: string[] = []
    buttonText: string[] = []
    constructor() {
        super();
        this.type = FormItemType.Transfer
    }
}
class UploadFormItem extends EditFormItem {
    listType: string = 'picture-card'
    constructor() {
        super();
        this.type = FormItemType.Upload
    }
}

class SlotFormItem extends EditFormItem {
    slot: SlotType | undefined
    constructor() {
        super();
        this.type = FormItemType.Slot
    }
}

class SlotType {
    default: string;

    constructor(defaultName: string) {
        this.default = defaultName
    }
}


export class SubmitConfig {
    btnText: string;
    submitFunc: (formValue: any) => Promise<ApiResponse<any>>;
    type: string;

    public constructor(submitFunc: Function, btnText?: string) {
        this.btnText = btnText || '提交'
        this.type = 'primary'
        // @ts-ignore
        this.submitFunc = submitFunc
    }
}

export class EditFormConfig {
    formItems: EditFormItem[];
    submitConfig: SubmitConfig | undefined;
    resettable: boolean;
    formValue: any;
    wrapperWidthPercent: number;
    validatable: boolean = false;
    rules: any;
    inline: boolean = false
    beforeSlotTemplate: SlotType;
    afterSlotTemplate: SlotType;

    public constructor() {
        this.formItems = []
        this.resettable = true
        this.wrapperWidthPercent = 50
    }

    public openValidate(): EditFormConfig {
        this.validatable = true
        let ruleObj: any = {}
        // @ts-ignore
        this.formItems.forEach(item => ruleObj[item.model] = item.rules)
        this.rules = ruleObj
        return this
    }

    public addBeforeSlotTemplate(beforeSlotName: string): EditFormConfig {
        this.beforeSlotTemplate = new SlotType(beforeSlotName)
        return this
    }

    public addAfterSlotTemplate(rightSlotName: string): EditFormConfig {
        this.afterSlotTemplate = new SlotType(rightSlotName)
        return this
    }

}

// @ts-ignore
export enum FormItemType {
    Password,
    Input,
    Checkbox,
    Radio,
    Select,
    Switch,
    Button,
    Upload,
    InputNumber,
    InputTag,
    DatePicker,
    DateTimePicker,
    Transfer,
    Slot,
    Textarea
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