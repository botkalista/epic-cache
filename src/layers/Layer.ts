import { Time } from "../models/Time";
import { BetterEmitter } from "../components/BetterEmitter";
import { CacheElement, DEFAULT_EXPIRE } from "../models/CacheElement";

type Nullable<T> = T | undefined;

type BaseEventsMap<SetType, GetType> = {
    get: (key: string, value: GetType, data: CacheElement<GetType>) => any;
    set: (key: string, value: SetType, data: CacheElement<SetType>) => any;
    expire: (key: string, value: GetType, data: CacheElement<GetType>) => any;
    remove: (key: string, value: GetType, data: CacheElement<GetType>) => any;
}

export type RequiredLayerOptions = {
    expireTime: Time,
    maxSize: number,
    clearExpiredOnSizeExceeded: boolean,
    sizeExceededStrategy: 'no-cache' | 'throw-error'
}

export abstract class Layer<
    SetType,
    GetType,
    LayerOptions extends RequiredLayerOptions,
> extends BetterEmitter<BaseEventsMap<SetType, GetType>> {

    protected options: LayerOptions;

    constructor(defaultOptions: LayerOptions) {
        super();
        this.options = defaultOptions;
    }

    protected isExpired(element: CacheElement<any>): boolean {
        return element.expireTimestamp < Date.now()
    }

    public getData(key: string) {
        const element = this.onGet(key);
        if (this.isExpired(element)) {
            this.emit('expire', key, element.value, element);
            this.onExpired(key, element);
            return;
        }
        this.emit('get', key, element.value, element);
        return element;
    }

    public removeData(key: string) {
        const element = this.onRemove(key);
        if (element) this.emit('remove', key, element.value, element);
        return this;
    }

    public setData(key: string, element: CacheElement<SetType>) {

        if (element.expireTimestamp == DEFAULT_EXPIRE)
            element.expireTimestamp = Date.now() + this.option('expireTime').value;

        if (this.getSize() < this.option('maxSize')) {
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

        if (this.getSize() < this.option('maxSize')) {
            this.onSet(key, element);
            this.emit('set', key, element.value, element);
            return this;
        }

        if (this.option('sizeExceededStrategy') === 'no-cache') return this;
        if (this.option('sizeExceededStrategy') === 'throw-error') throw Error('Cache size exceeded');

        this.emit('set', key, element.value, element);
        return this;
    }

    private clearExpired() {
        const expiredList = this.getExpired();
        expiredList.forEach(expired => this.onExpired(expired[0], expired[1]));
    }

    protected option<Key extends keyof LayerOptions>(optionName: Key): LayerOptions[Key] {
        return this.options[optionName];
    }


    protected abstract getSize(): number;
    protected abstract getExpired(): [string, CacheElement<GetType>][];
    protected abstract onExpired(key: string, element: CacheElement<GetType>): this;

    protected abstract onGet(key: string): Nullable<CacheElement<GetType>>;
    protected abstract onSet(key: string, element: CacheElement<SetType>): this;
    protected abstract onRemove(key: string): Nullable<CacheElement<GetType>>;

}