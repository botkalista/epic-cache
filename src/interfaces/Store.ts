import { CacheElement } from "../models/CacheElement";

export interface Store<DataType> {
    has(key: string): boolean;
    get(key: string): DataType;
    set(key: string, value: DataType): void;
    del(key: string): void;
    isExpired(key: string): boolean;
}