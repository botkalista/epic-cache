
const TIMEUNITS: Record<string, number> = {
    's': 1000,
    'm': 1000 * 60,
    'h': 1000 * 60 * 60,
    'd': 1000 * 60 * 60 * 24
}

export type TimeString = `${number}${keyof typeof TIMEUNITS}`

export type TimeConstructor = TimeString | number;

export class Time {

    public value: number;

    constructor(data: TimeConstructor) {
        this.value = this.convertToMilliseconds(data);
    }

    private convertToMilliseconds(data: TimeConstructor) {
        if (typeof data === 'number') return data;
        const numeric = parseInt(data);
        const unit = data.replace(numeric.toString(), '');
        const unitValue = TIMEUNITS[unit];
        if (!unitValue) throw Error(`Invalid unit value. Received ${unit}, expected ${Object.keys(TIMEUNITS).join('or')}`);
        return numeric * unitValue;
    }

    static from(data: TimeConstructor) {
        const instance = new Time(data);
        return instance;
    }

}