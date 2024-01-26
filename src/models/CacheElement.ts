import { createTimestamp, parseTimeString } from "../utils/TimeStringParser";
import { Time } from "./Time";




export class CacheElement<T = any> {

    public value: T;
    public expireTimestamp: number = -1;

    constructor(value: T, expireAtTimestamp?: number)
    constructor(value: T, expireAtDate?: Date)
    constructor(value: T, expireIn?: string)
    constructor(value: T, expireTime?: Time)
    constructor(value: T, expireAt?: any) {
        this.value = value;
        if (!expireAt) return;
        if (expireAt instanceof Time) {
            this.expireTimestamp = expireAt.value;
        } else {
            this.expireTimestamp = createTimestamp(expireAt);
        }
    }

    public isExpired() {
        if (this.expireTimestamp <= 0) return false;
        return this.expireTimestamp < Date.now();
    }

}