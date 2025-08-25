export function toClass<T>(data: Partial<T>, cls: new () => T): T {
    let instance: T = new cls()
    Object.assign(instance, data);
    return instance
}