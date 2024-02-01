import { Time, TimeConstructor } from "./Time";

export type Expiration = TimeConstructor | Time;

export class CacheElement<DataType> {
    public expireTimestamp: number;
    public value: DataType;

    constructor(value: DataType, expireIn?: Expiration) {
        this.value = value;

        if (!expireIn) {
            this.expireTimestamp = 0;
            return;
        }

        if (expireIn instanceof Time) {
            this.expireTimestamp = Date.now() + expireIn.value;
            return;
        }

        const time = Time.from(expireIn);
        this.expireTimestamp = Date.now() + time.value;
    };

    static from<T>(value: T, expireIn?: Expiration) {
        const instance = new CacheElement<T>(value, expireIn);
        return instance;
    }

    isExpired() {
        if (this.expireTimestamp == 0) return false;
        return this.expireTimestamp < Date.now();
    }

}




//TODO: REMOVE
export function createCacheElement<T>(value: T, expireIn?: Expiration, metadata?: any): CacheElement<T> {
    if (!expireIn) return { value, expireTimestamp: DEFAULT_EXPIRE };
    if (expireIn instanceof Time) {
        return { value, expireTimestamp: Date.now() + expireIn.value };
    } else {
        const time = Time.from(expireIn);
        return { value, expireTimestamp: Date.now() + time.value };
    }
}

//TODO: REMOVE
export function copyCacheElementWithValue<OldValue, Metadata, NewValue>(baseElement: CacheElement<OldValue>, newValue: NewValue): CacheElement<NewValue> {
    const newElement: CacheElement<NewValue> = {
        expireTimestamp: baseElement.expireTimestamp,
        value: newValue
    }
    return newElement;
}