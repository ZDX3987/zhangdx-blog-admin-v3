import {getStorageItem, removeStorageItem, setStorageItem} from "./local-storage.ts";

const authorization: string = 'Authorization'

export function getAuthorization(): string | null {
    return getStorageItem(authorization);
}
export function setAuthorization(value: string): void {
    setStorageItem(authorization, value);
}

export function removeAuthorization(): void {
    removeStorageItem(authorization);
}