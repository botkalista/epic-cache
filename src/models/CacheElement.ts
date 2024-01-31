import { Time, TimeConstructor } from "./Time";

export type CacheElement<T> = {
    expireTimestamp: number;
    value: T;
}

export type Expiration = TimeConstructor | Time;

export const DEFAULT_EXPIRE = -1;

export function createCacheElement<T>(value: T, expireIn?: Expiration): CacheElement<T> {
    if (!expireIn) return { value, expireTimestamp: DEFAULT_EXPIRE };
    if (expireIn instanceof Time) {
        return { value, expireTimestamp: Date.now() + expireIn.value };
    } else {
        const time = Time.from(expireIn);
        return { value, expireTimestamp: Date.now() + time.value };
    }
}
