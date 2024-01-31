import { MemoryLayer } from "../../src/layers/MemoryLayer";
import { createCacheElement } from "../../src/models/CacheElement";
import { Time } from "../../src/models/Time";

async function sleep(ms: number) { await new Promise(e => setTimeout(e, ms)); }

describe('MemoryLayer', () => {

    describe('Basic actions', () => {

        it('should get correct data', () => {
            const layer = new MemoryLayer<number>();

            const elementA = createCacheElement(123);
            layer.setData('a', elementA);

            const elementB = createCacheElement(321);
            layer.setData('b', elementB);

            const resultA = layer.getData('a');
            expect(resultA).toBe(elementA);

            const resultB = layer.getData('b');
            expect(resultB).toBe(elementB);
        });

        it('should expire correctly', async () => {

            const layer = new MemoryLayer<number>();

            const elementA = createCacheElement(123, '4s');
            layer.setData('a', elementA);
            expect(layer.getData('a')).toBe(elementA);
            expect(layer.size()).toBe(1);
            await sleep(1000);
            expect(layer.getData('a')).toBe(elementA);
            expect(layer.size()).toBe(1);

            const elementB = createCacheElement(321, '1s');
            layer.setData('b', elementB);
            expect(layer.getData('b')).toBe(elementB);
            expect(layer.size()).toBe(2);
            await sleep(2000);
            expect(layer.getData('b')).toBeUndefined();
            expect(layer.size()).toBe(1);

            expect(layer.getData('a')).toBe(elementA);
            expect(layer.size()).toBe(1);
            await sleep(2000);
            expect(layer.getData('a')).toBeUndefined();
            expect(layer.size()).toBe(0);


        }, 7000);

    });

    describe('Events', () => {

        it('should fire onGet', () => {
            const layer = new MemoryLayer<number>();

            const cacheElement = createCacheElement(123);
            layer.setData('test', cacheElement);

            const getCallback = jest.fn((key, value, element) => {
                expect(key).toBe('test');
                expect(value).toBe(123);
                expect(element).toBe(cacheElement);
            });

            const getEmptyCallback = jest.fn((key) => {
                expect(key).toBe('test');
            });

            layer.on('get', getCallback);

            layer.getData('test');

            expect(getCallback).toHaveBeenCalledTimes(1);
            expect(getCallback).toHaveBeenCalledWith('test', 123, cacheElement);
            expect(getEmptyCallback).not.toHaveBeenCalled();
        });

        it('should fire onGetEmpty', () => {
            const layer = new MemoryLayer<number>();

            const getEmptyCallback = jest.fn((key) => {
                expect(key).toBe('test');
            });

            const getCallback = jest.fn((key) => { });

            layer.on('getEmpty', getEmptyCallback);
            layer.getData('test');

            expect(getEmptyCallback).toHaveBeenCalledTimes(1);
            expect(getEmptyCallback).toHaveBeenCalledWith('test');
            expect(getCallback).not.toHaveBeenCalled();
        });

        it('should fire onExpire', async () => {

            const layer = new MemoryLayer<number>();

            const element = createCacheElement<number>(123, '1s');

            const expireCallback = jest.fn((key, value, data) => {
                expect(key).toBe('test');
                expect(value).toBe(123);
                expect(data).toBe(element);
            });

            layer.on('expire', expireCallback);

            layer.setData('test', element);
            await sleep(2000);

            const result = layer.getData('test');
            expect(result).toBeUndefined();

            expect(expireCallback).toHaveBeenCalledTimes(1);
            expect(expireCallback).toHaveBeenCalledWith('test', 123, element);

        }, 4000);

        it('should fire onDelete', async () => {
            throw Error('Not implemented');
        });

        it('should fire onSet', async () => {
            throw Error('Not implemented');
        });

    });

    describe.only('Options', () => {

        it('should expire on expireTime', async () => {
            const layer = new MemoryLayer<number>({ expireTime: Time.from('1s') });
            const cacheElement = createCacheElement(123);
            layer.setData('test', cacheElement);
            expect(layer.getData('test')).toBe(cacheElement);
            expect(layer.size()).toBe(1);
            await sleep(2000);
            expect(layer.getData('test')).toBeUndefined();
            expect(layer.size()).toBe(0);
        }, 5000);

        it('should clearExpiredOnSizeExceeded', async () => {

            const layer = new MemoryLayer<number>({
                clearExpiredOnSizeExceeded: true,
                sizeExceededStrategy: 'no-cache',
                maxSize: 2
            });

            layer.setData('test1', createCacheElement(99, '1s'));
            expect(layer.size()).toBe(1);

            await sleep(2000);

            layer.setData('test2', createCacheElement(99));
            expect(layer.size()).toBe(2);

            layer.setData('test3', createCacheElement(99));
            expect(layer.size()).toBe(2);

            expect(layer.getData('test3')?.value).toBe(99);
            expect(layer.getData('test1')).toBeUndefined();
            expect(layer.size()).toBe(2);

        }, 4000);

        it('should sizeExceededStrategy no-cache', async () => {
            const layer = new MemoryLayer<number>({
                clearExpiredOnSizeExceeded: false,
                sizeExceededStrategy: 'no-cache',
                maxSize: 2
            });
            layer.setData('test1', createCacheElement(99));
            layer.setData('test2', createCacheElement(99));
            layer.setData('test3', createCacheElement(99));
            expect(layer.getData('test3')).toBeUndefined();
        });

        // it('should sizeExceededStrategy throw-error', async () => {
        //     const cache = new GenericCache<number>({
        //         clearExpiredOnSizeExceeded: false,
        //         sizeExceededStrategy: 'throw-error',
        //         maxSize: 2
        //     });
        //     cache.add('test1', new CacheElement<number>(99));
        //     cache.add('test2', new CacheElement<number>(99));

        //     expect(() => {
        //         cache.add('test3', new CacheElement<number>(99));
        //     }).toThrow();

        // });

        //     it.skip('should expireOnInterval', async () => {
        //         throw ('Not implemented')
        //     });

        //     it.skip('should expireCheckInterval', async () => {
        //         throw ('Not implemented')
        //     });

    });


});

