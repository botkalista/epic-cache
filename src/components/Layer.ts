import { Time } from "../models/Time";
import { BetterEmitter } from "./BetterEmitter";
import { CacheElement, DEFAULT_EXPIRE } from "../models/CacheElement";
import { Store } from "../interfaces/Store";

type Nullable<T> = T | undefined;

type BaseEventsMap<DataType> = {
    get: (key: string) => any;
    set: (key: string, value: DataType) => any;
    remove: (key: string) => any;
    getEmpty: (key: string) => any;
    expire: (key: string) => any;
}

export type LayerOptions<DataType> = {
    expireTime: Time,
    maxSize: number,
    clearExpiredOnSizeExceeded: boolean,
    sizeExceededStrategy: (layer: Layer<DataType>) => any,
    expireOnInterval: boolean,
    expireCheckInterval?: Time
}

export abstract class Layer<DataType> extends BetterEmitter<BaseEventsMap<DataType>> {

    private expireInterval: NodeJS.Timeout;

    constructor(protected store: Store<CacheElement<DataType>>, protected options: LayerOptions<DataType>) {
        super();
        Object.seal(this.options);
        if (options.expireOnInterval) {
            const ms = options.expireCheckInterval;
            if (!ms) throw Error('"expireCheckInterval" is required when "expireOnInterval" is true')
            this.expireInterval = setInterval(() => {
                this.clearExpired();
            }, ms.value);
        }
    }


    public get(key: string) {

        const hasElement = this.store.has(key);
        if (!hasElement) {
            this.emit('getEmpty', key);
            return;
        }

        const expired = this.store.isExpired(key);
        if (expired) {
            this.emit('expire', key);
            this.store.del(key);
            return;
        }

        const element = this.store.get('key');
        this.emit('get', key);
        return element;

    }

    public set(key: string, data: DataType) {

        const cacheElement = CacheElement.from(data, this.options.expireTime);

        if (this.store.size() < this.options.maxSize) {
            this.emit('set', key, data);
            this.store.set(key, cacheElement);
            return;
        }

        // maxSize reached

        const hasElement = this.store.has(key);
        if (hasElement) {
            this.emit('set', key, data);
            this.store.set(key, cacheElement);
            return;
        }

        if (this.options.clearExpiredOnSizeExceeded) this.clearExpired();

        if (this.store.size() < this.options.maxSize) {
            this.emit('set', key, data);
            this.store.set(key, cacheElement);
            return;
        }

        this.options.sizeExceededStrategy(this);

    }

    public removeData(key: string) {
        const element = this.onRemove(key);
        if (element) this.emit('remove', key, element.value, element);
        return this;
    }

    public setData(key: string, element: CacheElement<SetType>) {

        if (element.expireTimestamp == DEFAULT_EXPIRE)
            element.expireTimestamp = Date.now() + this.option('expireTime').value;

        if (this.size() < this.option('maxSize')) {
            this.onSet(key, element);
            this.emit('set', key, element.value, element);
            return this;
        }

        // maxSize reached

        const hasElement = this.onGet(key);
        if (hasElement) {
            this.onSet(key, element);
            this.emit('set', key, element.value, element);
            return this;
        }

        if (this.option('clearExpiredOnSizeExceeded')) this.clearExpired();

        if (this.size() < this.option('maxSize')) {
            this.onSet(key, element);
            this.emit('set', key, element.value, element);
            return this;
        }

        if (this.option('sizeExceededStrategy') === 'no-cache') return this;
        if (this.option('sizeExceededStrategy') === 'throw-error') throw Error('Cache size exceeded');

        this.emit('set', key, element.value, element);
        return this;
    }

    public dispose() {
        if (this.expireInterval) clearInterval(this.expireInterval);
        this.clearExpired();
    }

    private clearExpired() {
        const expiredList = this.getExpired();
        expiredList.forEach(expired => {
            this.emit('expire', expired[0], expired[1].value, expired[1]);
            this.onExpired(expired[0], expired[1])
        });
    }

    protected option<Key extends keyof LayerOptions>(optionName: Key): LayerOptions[Key] {
        return this.options[optionName];
    }
}