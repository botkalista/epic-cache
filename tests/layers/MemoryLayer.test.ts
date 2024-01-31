import { MemoryLayer } from "../../src/layers/MemoryLayer";
import { createCacheElement } from "../../src/models/CacheElement";

async function sleep(ms: number) { await new Promise(e => setTimeout(e, ms)); }

describe('MemoryLayer', () => {

    describe('Basic actions', () => {

        it('should get correct data', () => {
            const cache = new MemoryLayer<number>();

            const elementA = createCacheElement(123);
            cache.setData('a', elementA);

            const elementB = createCacheElement(321);
            cache.setData('b', elementB);

            const resultA = cache.getData('a');
            expect(resultA).toBe(elementA);

            const resultB = cache.getData('b');
            expect(resultB).toBe(elementB);
        });

        //     it('should expire correctly', async () => {


        //         const cache = new GenericCache<number>();

        //         const element1 = new CacheElement<number>(123, '4s');
        //         cache.add('a', element1);
        //         expect(cache.get('a')).toBe(123);
        //         expect(cache.size()).toBe(1);
        //         await sleep(1000);
        //         expect(cache.get('a')).toBe(123);
        //         expect(cache.size()).toBe(1);

        //         const element2 = new CacheElement<number>(321, '1s');
        //         cache.add('b', element2);
        //         expect(cache.get('b')).toBe(321);
        //         expect(cache.size()).toBe(2);
        //         await sleep(2000);
        //         expect(cache.get('b')).toBeUndefined()
        //         expect(cache.size()).toBe(1);

        //         expect(cache.get('a')).toBe(123);
        //         expect(cache.size()).toBe(1);
        //         await sleep(2000);
        //         expect(cache.get('a')).toBeUndefined()
        //         expect(cache.size()).toBe(0);


        //     }, 8000);

    });

    // describe('Events', () => {

    //     it('should fire onGet', () => {
    //         const cache = new GenericCache<number>();

    //         cache.on('get', key => {
    //             expect(key).toBe('test');
    //         });

    //         cache.get('test');
    //     });

    //     it('should fire onExpire', async () => {
    //         const cache = new GenericCache<number>();

    //         cache.on('expire', key => {
    //             expect(key).toBe('test');
    //         });

    //         const element = new CacheElement<number>(123, '1s');
    //         cache.set('test', element);
    //         await sleep(2000);
    //         cache.get('test');

    //     });


    // });

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

