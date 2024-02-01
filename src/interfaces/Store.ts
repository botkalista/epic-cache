import { CacheElement } from "../models/CacheElement";

export interface Store<DataType> {

    has(key: string): boolean;
    get(key: string): DataType;
    set(key: string, value: CacheElement<DataType>): void;
    del(key: string): void;
    size(): number;
    isExpired(key: string): boolean;
    listExpired(): string[];
}