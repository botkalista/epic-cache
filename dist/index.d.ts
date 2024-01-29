declare const TIMEUNITS: Record<string, number>;
type TimeString = `${number}${keyof typeof TIMEUNITS}`;
type TimeConstructor = TimeString | number;
declare class Time {
    value: number;
    constructor(data: TimeConstructor);
    private convertToMilliseconds;
    static from(data: TimeConstructor): Time;
}

type Expiration = TimeConstructor | Time;
declare class CacheElement<ElementType = any> {
    static DEFAULT_TIMESTAMP: number;
    value: ElementType;
    expireTimestamp: number;
    constructor(value: ElementType, expireIn?: Expiration);
    withValue<NewValueType>(newValue: NewValueType): CacheElement<NewValueType>;
    copy(): CacheElement<ElementType>;
    static from<TElement = any>(value: TElement, expireIn?: Expiration): CacheElement<TElement>;
    isExpired(): boolean;
}

declare class BetterEmitter<EventsMap extends Record<string, (...args: any[]) => any>> {
    private handlers;
    protected emit<EventName extends keyof EventsMap>(event: EventName, ...data: Parameters<EventsMap[EventName]>): this;
    on<EventName extends keyof EventsMap>(event: EventName, callback: EventsMap[EventName]): this;
}

type EventsMap<CacheType> = {
    'get': (key: string) => any;
    "add": (key: string, value: CacheElement<CacheType>) => any;
    'expire': (key: string) => any;
    'delete': (key: string) => any;
};
declare abstract class Cache<CacheType = any, CacheOptions extends Record<string, any> = {}, SetType = CacheType, GetType = CacheType> extends BetterEmitter<EventsMap<CacheType>> {
    protected options: Required<CacheOptions>;
    protected cache: Map<string, CacheElement<CacheType>>;
    protected setTransform?: (key: string, element: CacheElement<SetType>) => CacheElement<CacheType>;
    protected getTransform?: (key: string, element: CacheElement<CacheType>) => CacheElement<GetType>;
    constructor(defaultOptions: Required<CacheOptions>);
    _rawCache(): Map<string, CacheElement<CacheType>>;
    size(): number;
    protected option<Key extends keyof CacheOptions>(optionName: Key): CacheOptions[Key];
    private getElement;
    private setElement;
    private removeElement;
    private clearExpired;
    protected processBeforeSet(callback: typeof this.setTransform): this;
    protected processBeforeGet(callback: typeof this.getTransform): this;
    set(key: string, element: CacheElement<SetType>): this;
    add(key: string, element: CacheElement<SetType>): this;
    get(key: string): GetType;
    del(key: string): this;
}

type SizeExceededStrategy = 'throw-error' | 'no-cache';
type GenericCacheOptions = {
    maxSize?: number;
    sizeExceededStrategy?: SizeExceededStrategy;
    clearExpiredOnSizeExceeded?: boolean;
    defaultExpireTime?: Time;
    expireOnInterval?: boolean;
    expireCheckInterval?: Time;
};
declare const defaultGenericCacheOptions: Required<GenericCacheOptions>;
declare class GenericCache<CacheType = any> extends Cache<CacheType, GenericCacheOptions> {
    constructor(options?: GenericCacheOptions);
}

export { CacheElement, type Expiration, GenericCache, type GenericCacheOptions, type SizeExceededStrategy, Time, type TimeConstructor, type TimeString, defaultGenericCacheOptions };
