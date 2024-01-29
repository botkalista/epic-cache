declare const TIMEUNITS: Record<string, number>;
type TimeString$1 = `${number}${keyof typeof TIMEUNITS}`;
type TimeConstructor = TimeString$1 | number;
declare class Time$1 {
    value: number;
    constructor(data: TimeConstructor);
    private convertToMilliseconds;
    static from(data: TimeConstructor): Time$1;
}

type Expiration = TimeConstructor | Time$1;
declare class CacheElement$1<ElementType = any> {
    static DEFAULT_TIMESTAMP: number;
    value: ElementType;
    expireTimestamp: number;
    constructor(value: ElementType, expireIn?: Expiration);
    withValue<NewValueType>(newValue: NewValueType): CacheElement$1<NewValueType>;
    copy(): CacheElement$1<ElementType>;
    static from<TElement = any>(value: TElement, expireIn?: Expiration): CacheElement$1<TElement>;
    isExpired(): boolean;
}

type SizeExceededStrategy$1 = 'throw-error' | 'no-cache';
type GenericCacheOptions = {
    maxSize?: number;
    sizeExceededStrategy?: SizeExceededStrategy$1;
    clearExpiredOnSizeExceeded?: boolean;
    defaultExpireTime?: Time$1;
    expireOnInterval?: boolean;
    expireCheckInterval?: Time$1;
};

declare const CacheElement: typeof CacheElement$1;
declare const Time: typeof Time$1;
type TimeString = TimeString$1;
type GenericCache = GenericCacheOptions;
type SizeExceededStrategy = SizeExceededStrategy$1;

export { CacheElement, type GenericCache, type SizeExceededStrategy, Time, type TimeString };
