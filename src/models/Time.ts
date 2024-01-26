import { createTimestamp } from "../utils/TimeStringParser";

export class Time {
    public value: number;
    constructor(data: number | string) { this.value = createTimestamp(data); }
    static from(data: number | string) {
        const instance = new Time(data);
        return instance;
    }
}