import { Time, TimeConstructor } from "./Time";



export type Expiration = TimeConstructor | Time;

export class CacheElement<TElement = any> {

    public value: TElement;
    public expireTimestamp: number = -1;

    constructor(value: TElement, expireIn?: Expiration) {
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