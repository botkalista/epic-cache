import { GenericCache } from "../src/caches/GenericCache";
import { CacheElement } from "../src/models/CacheElement";
import { Time } from "../src/models/Time";


describe('Expiration time', () => {

    describe('Time class', () => {

        it('should create correctly TimeString', () => {
            const time = Time.from('1s');
            expect(time.value).toBe(1000);
        });

        it('should create correctly timestamp', () => {
            const time = Time.from(1000);
            expect(time.value).toBe(1000);
        });

    });

    describe('Cache element creation', () => {

        it('should create correctly TimeString', () => {
            const sElement = new CacheElement(null, '1s');
            expect(sElement.expireTimestamp).toBeGreaterThanOrEqual(Date.now());
            expect(sElement.expireTimestamp).toBeLessThanOrEqual(Date.now() + 1000);

            const mElement = new CacheElement(null, '3m');
            expect(mElement.expireTimestamp).toBeGreaterThanOrEqual(Date.now());
            expect(mElement.expireTimestamp).toBeLessThanOrEqual(Date.now() + 1000 * 60 * 3);

            const hElement = new CacheElement(null, '2h');
            expect(hElement.expireTimestamp).toBeGreaterThanOrEqual(Date.now());
            expect(hElement.expireTimestamp).toBeLessThanOrEqual(Date.now() + 1000 * 60 * 60 * 2);
        });

        it('should create correctly timestamp', () => {
            const sElement = new CacheElement(null, 1000);
            expect(sElement.expireTimestamp).toBeGreaterThanOrEqual(Date.now());
            expect(sElement.expireTimestamp).toBeLessThanOrEqual(Date.now() + 1000);

            const mElement = new CacheElement(null, 1000 * 60 * 3);
            expect(mElement.expireTimestamp).toBeGreaterThanOrEqual(Date.now());
            expect(mElement.expireTimestamp).toBeLessThanOrEqual(Date.now() + 1000 * 60 * 3);

            const hElement = new CacheElement(null, 1000 * 60 * 60 * 2);
            expect(hElement.expireTimestamp).toBeGreaterThanOrEqual(Date.now());
            expect(hElement.expireTimestamp).toBeLessThanOrEqual(Date.now() + 1000 * 60 * 60 * 2);
        });

        it('should create correctly Time', () => {
            const sElement = new CacheElement(null, Time.from('1s'));
            expect(sElement.expireTimestamp).toBeGreaterThanOrEqual(Date.now());
            expect(sElement.expireTimestamp).toBeLessThanOrEqual(Date.now() + 1000);

            const mElement = new CacheElement(null, Time.from(1000 * 60 * 3));
            expect(mElement.expireTimestamp).toBeGreaterThanOrEqual(Date.now());
            expect(mElement.expireTimestamp).toBeLessThanOrEqual(Date.now() + 1000 * 60 * 3);

            const hElement = new CacheElement(null, Time.from('2h'));
            expect(hElement.expireTimestamp).toBeGreaterThanOrEqual(Date.now());
            expect(hElement.expireTimestamp).toBeLessThanOrEqual(Date.now() + 1000 * 60 * 60 * 2);
        });

    })

});