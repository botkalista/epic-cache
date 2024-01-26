
import { Time } from "../models/Time";
import { Cache } from "./Cache";


export type SizeExceededStrategy = 'throw-error' | 'no-cache'

export type GenericCacheOptions = {
    maxSize?: number,
    sizeExceededStrategy?: SizeExceededStrategy,
    clearExpiredOnSizeExceeded?: boolean,
    defaultExpireTime?: Time,
    expireOnInterval?: boolean,
    expireCheckInterval?: Time
}

export const defaultGenericCacheOptions: Required<GenericCacheOptions> = {
    maxSize: 1000,
    sizeExceededStrategy: 'no-cache',
    clearExpiredOnSizeExceeded: true,
    defaultExpireTime: Time.from('15m'),
    expireOnInterval: true,
    expireCheckInterval: Time.from('10m')
}

export class GenericCache<CacheType = any> extends Cache<CacheType, GenericCacheOptions> {
    constructor(options?: GenericCacheOptions) {
        super({ ...defaultGenericCacheOptions, ...options });

        super
            .processBeforeGet((key, element) => element)
            .processBeforeSet((key, element) => element)

    }
}