import { MemoryLayer } from "../../src/layers/MemoryLayer";
import { createCacheElement } from "../../src/models/CacheElement";

async function sleep(ms: number) { await new Promise(e => setTimeout(e, ms)); }

describe('MemoryLayer', () => {

    describe.skip('Basic actions', () => {

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


        }, 8000);

    });

    describe('Events', () => {

        it('should fire onGet', () => {
            const layer = new MemoryLayer<number>();

            layer.setData('testA', createCacheElement(123));

            const getEmptyCallback = jest.fn((key) => {
                expect(key).toBe('test');
            });

            const getCallback = jest.fn((key, value, element) => {
                expect(key).toBe('test');
                expect(value).toBe('test');
                expect(value).toBe('test');
            });

            layer.on('getEmpty', getEmptyCallback);
            layer.on('get', getCallback);

            layer.getData('testA');
            layer.getData('testB');

            expect(getEmptyCallback).not.toHaveBeenCalled();
            expect(getCallback).toHaveBeenCalledTimes(1);
            expect(getEmptyCallback).toHaveBeenCalledWith('test')
        });

        // it('should fire onExpire', async () => {
        //     const cache = new GenericCache<number>();

        //     cache.on('expire', key => {
        //         expect(key).toBe('test');
        //     });

        //     const element = new CacheElement<number>(123, '1s');
        //     cache.set('test', element);
        //     await sleep(2000);
        //     cache.get('test');

        // });


    });

    // describe('Options', () => {

    //     it('should expire on defaultExpireTime', async () => {
    //         const cache = new GenericCache<number>({ defaultExpireTime: Time.from('1s') });
    //         cache.add('test', new CacheElement<number>(123));
    //         expect(cache.get('test')).toBe(123);
    //         await sleep(2000);
    //         expect(cache.get('test')).toBeUndefined();
    //         expect(cache.size()).toBe(0);
    //     }, 5000);

    //     it('should clearExpiredOnSizeExceeded', async () => {

    //         const cache = new GenericCache<number>({
    //             clearExpiredOnSizeExceeded: true,
    //             sizeExceededStrategy: 'no-cache',
    //             maxSize: 2
    //         });

    //         cache.add('test1', new CacheElement<number>(99, '1s'));
    //         expect(cache.size()).toBe(1);

    //         await sleep(2000);

    //         cache.add('test2', new CacheElement<number>(99));
    //         expect(cache.size()).toBe(2);

    //         cache.add('test3', new CacheElement<number>(99));
    //         expect(cache.size()).toBe(2);

    //         expect(cache.get('test3')).toBe(99);
    //         expect(cache.get('test1')).toBeUndefined();
    //         expect(cache.size()).toBe(2);

    //     }, 5000);

    //     it('should sizeExceededStrategy no-cache', async () => {
    //         const cache = new GenericCache<number>({
    //             clearExpiredOnSizeExceeded: false,
    //             sizeExceededStrategy: 'no-cache',
    //             maxSize: 2
    //         });
    //         cache.add('test1', new CacheElement<number>(99));
    //         cache.add('test2', new CacheElement<number>(99));
    //         cache.add('test3', new CacheElement<number>(99));
    //         expect(cache.get('test3')).toBeUndefined();
    //     });

    //     it('should sizeExceededStrategy throw-error', async () => {
    //         const cache = new GenericCache<number>({
    //             clearExpiredOnSizeExceeded: false,
    //             sizeExceededStrategy: 'throw-error',
    //             maxSize: 2
    //         });
    //         cache.add('test1', new CacheElement<number>(99));
    //         cache.add('test2', new CacheElement<number>(99));

    //         expect(() => {
    //             cache.add('test3', new CacheElement<number>(99));
    //         }).toThrow();

    //     });

    //     it.skip('should expireOnInterval', async () => {
    //         throw ('Not implemented')
    //     });

    //     it.skip('should expireCheckInterval', async () => {
    //         throw ('Not implemented')
    //     });

    // });


});

