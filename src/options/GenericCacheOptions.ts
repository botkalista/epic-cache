import { Time } from "../models/Time"

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