import { Time } from "../models/Time";
import { BetterEmitter } from "./BetterEmitter";
import { CacheElement, Expiration } from "../models/CacheElement";
import { Store } from "../interfaces/Store";
import { SizeExceededStrategy } from "../strategies/SizeExceededStrategies";

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
    sizeExceededStrategy: SizeExceededStrategy<DataType>,
    expireOnInterval: boolean,
    expireCheckInterval?: Time
}

export class Layer<DataType> extends BetterEmitter<BaseEventsMap<DataType>> {

    private expireInterval: NodeJS.Timeout;

    constructor(protected store: Store<DataType>, protected options: LayerOptions<DataType>) {
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

        const element = this.store.get(key);
        this.emit('get', key);
        return element;

    }

    public set(key: string, data: DataType, expireIn?: Expiration) {

        const cacheElement = CacheElement.from(data, expireIn || this.options.expireTime);

        if (this.store.size() < this.options.maxSize) {
            this.emit('set', key, data);
            this.store.set(key, cacheElement);
            return true;
        }

        // maxSize reached

        const hasElement = this.store.has(key);
        if (hasElement) {
            this.emit('set', key, data);
            this.store.set(key, cacheElement);
            return true;
        }

        if (this.options.clearExpiredOnSizeExceeded) this.clearExpired();

        if (this.store.size() < this.options.maxSize) {
            this.emit('set', key, data);
            this.store.set(key, cacheElement);
            return true;
        }

        this.options.sizeExceededStrategy(this);
        
        return false;

    }

    public del(key: string) {
        if (!this.store.has(key)) return;
        this.emit('remove', key);
        this.store.del(key);
    }

    public size() {
        return this.store.size();
    }

    public has(key: string) {
        return this.store.has(key);
    }

    public dispose() {
        if (this.expireInterval) clearInterval(this.expireInterval);
        this.clearExpired();
    }

    private clearExpired() {
        const expiredList = this.store.listExpired();
        expiredList.forEach(expired => {
            this.emit('expire', expired);
            this.del(expired);
        });
    }

}