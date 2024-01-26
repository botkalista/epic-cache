import { CacheElement } from "../models/CacheElement";
import { defaultGenericCacheOptions, GenericCacheOptions } from "../options/GenericCacheOptions";

export type CacheEvent = 'get' | 'expire';

type CacheEventHandler = { type: CacheEvent, callback: (...args: any) => any }

type CallbackTypeMap<CacheValue extends any> = {
    'get': (key: string) => any;
    'expire': (key: string, value: CacheValue | undefined, expiredAt: number) => any;
}

export class GenericCache<CacheValue = any> {
    private handlers: CacheEventHandler[] = [];
    private cache = new Map<string, CacheElement<CacheValue>>();
    protected options: Required<GenericCacheOptions>;

    constructor(options?: GenericCacheOptions) {
        this.options = { ...defaultGenericCacheOptions, ...options }
    }

    _rawCache() { return this.cache; }


    set(key: string, element: CacheElement<CacheValue>) {
        this.add(key, element);
    }

    add(key: string, element: CacheElement<CacheValue>) {

        if (element.expireTimestamp == -1) element.expireTimestamp = this.options.defaultExpireTime.value;

        if (this.cache.size < this.options.maxSize) {
            this.cache.set(key, element);
            return this;
        }

        // maxSize reached

        const hasElement = this.cache.has(key);
        if (hasElement) {
            this.cache.set(key, element);
            return this;
        }

        if (this.options.clearExpiredOnSizeExceeded) this.clearExpired();

        if (this.cache.size < this.options.maxSize) {
            this.cache.set(key, element);
            return this;
        }

        if (this.options.sizeExceededStrategy === 'no-cache') return this;
        if (this.options.sizeExceededStrategy === 'throw-error') throw Error('Cache size exceeded');
    }

    get(key: string) {
        this.emit('get', key);
        const element = this.cache.get(key);
        if (!element) return;
        if (!element.isExpired()) return element.value;
        this.emit('expire', key, element.value, element.expireTimestamp);
        this.cache.delete(key);
        return;
    }

    private clearExpired() {
        console.log('clearExpired')
        const toDelete: string[] = []
        for (const key in this.cache) {
            if (this.cache.get(key).isExpired()) toDelete.push(key);
        }
        toDelete.forEach(e => this.cache.delete(e));
    }

    protected emit<EventName extends CacheEvent>(event: EventName, ...data: Parameters<CallbackTypeMap<CacheValue>[EventName]>) {
        this.handlers.filter(handler => handler.type == event).forEach(handler => {
            handler.callback(...data);
        });
        return this;
    }

    on<EventName extends CacheEvent>(event: EventName, callback: CallbackTypeMap<CacheValue>[EventName]) {
        this.handlers.push({ type: event, callback });
        return this;
    }

}