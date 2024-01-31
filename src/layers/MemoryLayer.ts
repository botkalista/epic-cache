
import { Time } from "../models/Time";
import { CacheElement } from "../models/CacheElement";
import { ICacheLayer } from "../interfaces/ICacheLayer";
import { Layer, RequiredLayerOptions } from "./Layer";

export type MemoryLayerOptions = RequiredLayerOptions;

const defaultMemoryLayerOptions: Required<MemoryLayerOptions> = {
    expireTime: Time.from('5m'),
    clearExpiredOnSizeExceeded: true,
    maxSize: 100,
    sizeExceededStrategy: 'no-cache'
}

export class MemoryLayer<StoreType>
    extends Layer<StoreType, StoreType, MemoryLayerOptions>
    implements ICacheLayer<StoreType> {



    constructor(options: Partial<MemoryLayerOptions>) {
        super({ ...defaultMemoryLayerOptions, ...options });
    }

    private data = new Map<string, CacheElement<StoreType>>();

    protected getSize(): number {
        return this.data.size
    }

    protected getExpired(): [string, CacheElement<StoreType>][] {
        return Array.from(this.data.entries()).filter(e => this.isExpired(e[1]));
    }

    protected onExpired(key: string, element: CacheElement<StoreType>): this {
        this.data.delete(key);
        return this;
    }

    protected onGet(key: string): CacheElement<StoreType> {
        return this.data.get(key);
    }

    protected onSet(key: string, element: CacheElement<StoreType>): this {
        this.data.set(key, element);
        return this;
    }

    protected onRemove(key: string): CacheElement<StoreType> {
        const elem = this.data.get(key);
        this.data.delete(key);
        return elem;
    }

}
