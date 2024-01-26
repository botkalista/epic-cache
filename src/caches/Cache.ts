import { BetterEmitter } from "../components/BetterEmitter";
import { CacheElement } from "../models/CacheElement";


type EventsMap<CacheType> = {
    'get': (key: string) => any;
    "add": (key: string, value: CacheElement<CacheType>) => any;
    'expire': (key: string) => any;
    'delete': (key: string) => any;
}

export abstract class Cache<
    CacheType = any,
    CacheOptions extends Record<string, any> = {},
    SetType = CacheType,
    GetType = CacheType
> extends BetterEmitter<EventsMap<CacheType>> {

    protected options: Required<CacheOptions>;
    private cache = new Map<string, CacheElement<CacheType>>();

    protected setTransform?: (key: string, element: CacheElement<SetType>) => CacheElement<CacheType>;
    protected getTransform?: (key: string, element: CacheElement<CacheType>) => CacheElement<GetType>;

    constructor(defaultOptions: Required<CacheOptions>) {
        super();
        this.options = defaultOptions;
    }

    _rawCache() { return this.cache; }
    size() { return this.cache.size; }

    option(optionName: keyof CacheOptions) { return this.options[optionName]; }

    private getElement(key: string) {
        if (!this.getTransform) throw Error('processBeforeGet not called');
        const element = this.cache.get(key);
        const result = this.getTransform(key, element);
        return result.value;
    }
    private setElement(key: string, element: CacheElement<SetType>) {
        if (!this.setTransform) throw Error('processBeforeSet not called');
        const processedElement = this.setTransform(key, element);
        this.cache.set(key, processedElement);
        this.emit('add', key, processedElement);
        return this;
    }
    private removeElement(key: string, expired: boolean) {
        this.cache.delete(key);
        this.emit(expired ? 'expire' : 'delete', key);
        return this;
    }

    private clearExpired() {
        const toDelete: string[] = []
        for (const key of this.cache.keys()) {
            if (this.cache.get(key).isExpired()) toDelete.push(key);
        }
        toDelete.forEach(e => this.removeElement(e, true));
    }

    protected processBeforeSet(callback: typeof this.setTransform) {
        this.setTransform = callback;
        return this;
    }
    protected processBeforeGet(callback: typeof this.getTransform) {
        this.getTransform = callback;
        return this;
    }

    set(key: string, element: CacheElement<SetType>) {
        return this.add(key, element);
    }
    add(key: string, element: CacheElement<SetType>) {

        if (element.expireTimestamp == CacheElement.DEFAULT_TIMESTAMP)
            element.expireTimestamp = Date.now() + this.options.defaultExpireTime.value;

        if (this.cache.size < this.options.maxSize)
            return this.setElement(key, element);

        // maxSize reached

        const hasElement = this.cache.has(key);
        if (hasElement) return this.setElement(key, element);

        if (this.options.clearExpiredOnSizeExceeded)
            this.clearExpired();

        if (this.cache.size < this.options.maxSize)
            return this.setElement(key, element);

        if (this.options.sizeExceededStrategy === 'no-cache')
            return this;

        if (this.options.sizeExceededStrategy === 'throw-error')
            throw Error('Cache size exceeded');

    }
    get(key: string) {
        const element = this.cache.get(key);
        if (!element) return;
        if (!element.isExpired()) return this.getElement(key);
        this.emit('expire', key);
        this.removeElement(key, false);
        return;
    }
}