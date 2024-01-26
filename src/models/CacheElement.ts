import { Time, TimeConstructor } from "./Time";



export type Expiration = TimeConstructor | Time;

export class CacheElement<ElementType = any> {

    public static DEFAULT_TIMESTAMP = -1;

    public value: ElementType;
    public expireTimestamp: number = CacheElement.DEFAULT_TIMESTAMP;

    constructor(value: ElementType, expireIn?: Expiration) {
        this.value = value;
        if (!expireIn) return;
        if (expireIn instanceof Time) {
            this.expireTimestamp = Date.now() + expireIn.value;
        } else {
            const time = Time.from(expireIn);
            this.expireTimestamp = Date.now() + time.value;
        }
    }

    static from<TElement = any>(value: TElement, expireIn?: Expiration) {
        const instance = new CacheElement(value, expireIn);
        return instance;
    }

    public isExpired() {
        if (this.expireTimestamp <= 0) return false;
        return this.expireTimestamp < Date.now();
    }

}