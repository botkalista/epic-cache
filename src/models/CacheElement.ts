import { Time, TimeConstructor } from "./Time";

export type CacheElement<T, M = any> = {
    expireTimestamp: number;
    value: T;
    metadata?: M;
}

export type Expiration = TimeConstructor | Time;

export const DEFAULT_EXPIRE = -1;

export function createCacheElement<T>(value: T, expireIn?: Expiration, metadata?: any): CacheElement<T> {
    if (!expireIn) return { value, expireTimestamp: DEFAULT_EXPIRE };
    if (expireIn instanceof Time) {
        return { value, expireTimestamp: Date.now() + expireIn.value, metadata };
    } else {
        const time = Time.from(expireIn);
        return { value, expireTimestamp: Date.now() + time.value, metadata };
    }
}

export function copyCacheElementWithValue<OldValue, Metadata, NewValue>(baseElement: CacheElement<OldValue, Metadata>, newValue: NewValue): CacheElement<NewValue, Metadata> {
    const newElement: CacheElement<NewValue, Metadata> = {
        expireTimestamp: baseElement.expireTimestamp,
        metadata: baseElement.metadata,
        value: newValue
    }
    return newElement;
}