
const TIMEUNITS: Record<string, number> = {
    's': 1000,
    'm': 1000 * 60,
    'h': 1000 * 60 * 60,
    'd': 1000 * 60 * 60 * 24
}

export function parseTimeString(str: string) {
    const numeric = parseInt(str);
    const unit = str.replace(numeric.toString(), '');
    const unitValue = TIMEUNITS[unit];
    if (!unitValue) throw Error(`Invalid unit value. Received ${unit}, expected ${Object.keys(TIMEUNITS).join('or')}`);
    return numeric * unitValue;
}

export function createTimestamp(expireAt: Date | number | string) {
    if (expireAt instanceof Date) return expireAt.getTime();
    if (typeof expireAt === 'number') return Date.now() + expireAt;
    return Date.now() + parseTimeString(expireAt);
}