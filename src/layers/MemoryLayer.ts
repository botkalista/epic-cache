
import { Time } from "../models/Time";
import { CacheElement } from "../models/CacheElement";
import { ICacheLayerVolatile } from "../interfaces/ICacheLayer";
import { Layer, RequiredLayerOptions } from "../components/Layer";

export type MemoryLayerOptions = RequiredLayerOptions;

export const defaultMemoryLayerOptions: MemoryLayerOptions = {
    expireTime: Time.from('5m'),
    clearExpiredOnSizeExceeded: true,
    maxSize: 1000,
    sizeExceededStrategy: 'no-cache',
    expireOnInterval: false
}

export class MemoryLayer<StoreType>
    extends Layer<StoreType, StoreType, MemoryLayerOptions>
    implements ICacheLayerVolatile<StoreType, StoreType> {
    type: "volatile";

    constructor(options?: Partial<MemoryLayerOptions>) {
        super({ ...defaultMemoryLayerOptions, ...options });
    }

    private data = new Map<string, CacheElement<StoreType>>();

    public size(): number {
        return this.data.size;
    }

    protected getExpired(): [string, CacheElement<StoreType>][] {
        return Array.from(this.data.entries()).filter(e => this.isElementExpired(e[1]));
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

    protected onHas(key: string): boolean {
        return this.data.has(key);
    }

    protected onRemove(key: string): CacheElement<StoreType> {
        const elem = this.data.get(key);
        this.data.delete(key);
        return elem;
    }

}
