import {toClass} from "../utils/to-class.ts";

export class ResultPage<E> {
    current: number;
    pages: number;
    size: number;
    total: number;
    records: E[]

    static build<E>(data: Partial<ResultPage<E>>, cls: new () => E): ResultPage<E> {
        let instance = toClass(data, ResultPage<E>)
        instance.records = instance.records.map(e => toClass(e, cls))
        return instance
    }

    isEmpty(): boolean {
        return this.total === 0
    }


}