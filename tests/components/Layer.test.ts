import { Layer } from "../../src/components/Layer";
import { Time } from "../../src/models/Time";

import { MemoryStore } from '../../src/stores/MemoryStore';
import { SIZE_EXCEEDED_STRATEGY } from "../../src/strategies/SizeExceededStrategies";

async function sleep(ms: number) { await new Promise(e => setTimeout(e, ms)); }

describe('Layer', () => {

    describe('Basic actions', () => {

        it('should has data', () => {

            const store = new MemoryStore<number>();

            const layer = new Layer(store, {
                maxSize: 100,
                expireTime: Time.from('1m'),
                expireOnInterval: false,
                clearExpiredOnSizeExceeded: false,
                sizeExceededStrategy: SIZE_EXCEEDED_STRATEGY["no-cache"](),
            });

            layer.set('a', 123);
            expect(layer.has('a')).toBe(true);
            expect(layer.has('b')).toBe(false);

        });

        it('should get data', () => {

            const store = new MemoryStore<number>();

            const layer = new Layer(store, {
                maxSize: 100,
                expireTime: Time.from('1m'),
                expireOnInterval: false,
                clearExpiredOnSizeExceeded: false,
                sizeExceededStrategy: SIZE_EXCEEDED_STRATEGY["no-cache"](),
            });

            layer.set('a', 123);
            layer.set('b', 321);

            expect(layer.get('a')).toBe(123);
            expect(layer.get('b')).toBe(321);

        });

        it('should expire', async () => {

            const store = new MemoryStore<number>();

            const layer = new Layer(store, {
                maxSize: 100,
                expireTime: Time.from('1s'),
                expireOnInterval: false,
                clearExpiredOnSizeExceeded: false,
                sizeExceededStrategy: SIZE_EXCEEDED_STRATEGY["no-cache"](),
            });

            layer.set('a', 123, '4s');
            expect(layer.get('a')).toBe(123);
            expect(layer.size()).toBe(1);
            await sleep(1000);
            expect(layer.get('a')).toBe(123);
            expect(layer.size()).toBe(1);

            layer.set('b', 321);
            expect(layer.get('b')).toBe(321);
            expect(layer.size()).toBe(2);
            await sleep(2000);
            expect(layer.get('b')).toBeUndefined();
            expect(layer.size()).toBe(1);

            expect(layer.get('a')).toBe(123);
            expect(layer.size()).toBe(1);
            await sleep(2000);
            expect(layer.get('a')).toBeUndefined();
            expect(layer.size()).toBe(0);


        }, 7000);

        it('should remove data', () => {

            const store = new MemoryStore<number>();

            const layer = new Layer(store, {
                maxSize: 100,
                expireTime: Time.from('1s'),
                expireOnInterval: false,
                clearExpiredOnSizeExceeded: false,
                sizeExceededStrategy: SIZE_EXCEEDED_STRATEGY["no-cache"](),
            });

            layer.set('a', 123);
            expect(layer.size()).toBe(1);
            layer.del('a');
            expect(layer.get('a')).toBeUndefined();
            expect(layer.size()).toBe(0);
        });

    });

    describe.only('Events', () => {

        it('should fire onGet', () => {

            const store = new MemoryStore<number>();

            const layer = new Layer(store, {
                maxSize: 100,
                expireTime: Time.from('1m'),
                expireOnInterval: false,
                clearExpiredOnSizeExceeded: false,
                sizeExceededStrategy: SIZE_EXCEEDED_STRATEGY["no-cache"](),
            });

            layer.set('test', 123);

            const getCallback = jest.fn();
            const getEmptyCallback = jest.fn();

            layer.on('get', getCallback);
            layer.on('getEmpty', getEmptyCallback);

            layer.get('test');

            expect(getCallback).toHaveBeenCalledTimes(1);
            expect(getCallback).toHaveBeenCalledWith('test');
            expect(getEmptyCallback).not.toHaveBeenCalled();

        });

        it('should fire onGetEmpty', () => {

            const store = new MemoryStore<number>();

            const layer = new Layer(store, {
                maxSize: 100,
                expireTime: Time.from('1m'),
                expireOnInterval: false,
                clearExpiredOnSizeExceeded: false,
                sizeExceededStrategy: SIZE_EXCEEDED_STRATEGY["no-cache"](),
            });

            const getCallback = jest.fn();
            const getEmptyCallback = jest.fn();

            layer.on('get', getCallback);
            layer.on('getEmpty', getEmptyCallback);

            layer.get('test');

            expect(getEmptyCallback).toHaveBeenCalledTimes(1);
            expect(getEmptyCallback).toHaveBeenCalledWith('test');
            expect(getCallback).not.toHaveBeenCalled();

        });

        it('should fire onExpire', async () => {

            const store = new MemoryStore<number>();

            const layer = new Layer(store, {
                maxSize: 100,
                expireTime: Time.from('1m'),
                expireOnInterval: false,
                clearExpiredOnSizeExceeded: false,
                sizeExceededStrategy: SIZE_EXCEEDED_STRATEGY["no-cache"](),
            });

            const expireCallback = jest.fn();
            const removeCallback = jest.fn();

            layer.on('expire', expireCallback);
            layer.on('remove', removeCallback);

            layer.set('test', 123, '1s');
            await sleep(2000);

            const result = layer.get('test');
            expect(result).toBeUndefined();

            expect(expireCallback).toHaveBeenCalledTimes(1);
            expect(expireCallback).toHaveBeenCalledWith('test');
            expect(removeCallback).not.toHaveBeenCalled();

        }, 4000);

        it('should fire onRemove', async () => {
            const store = new MemoryStore<number>();

            const layer = new Layer(store, {
                maxSize: 100,
                expireTime: Time.from('1m'),
                expireOnInterval: false,
                clearExpiredOnSizeExceeded: false,
                sizeExceededStrategy: SIZE_EXCEEDED_STRATEGY["no-cache"](),
            });

            const expireCallback = jest.fn();
            const removeCallback = jest.fn();

            layer.on('expire', expireCallback);
            layer.on('remove', removeCallback);

            layer.set('test', 123);
            layer.del('test');

            // Not exist so remove should not be emitted
            layer.del('test2');

            expect(removeCallback).toHaveBeenCalledTimes(1);
            expect(removeCallback).toHaveBeenCalledWith('test');
            expect(expireCallback).not.toHaveBeenCalled();

        });

        //     it('should fire onSet', async () => {
        //         const layer = new MemoryLayer<number>();

        //         const cacheElement = createCacheElement(123);

        //         const setCallback = jest.fn((key, value, element) => {
        //             expect(key).toBe('test');
        //             expect(value).toBe(123);
        //             expect(element).toBe(cacheElement);
        //         });

        //         layer.on('set', setCallback);

        //         layer.setData('test', cacheElement);


        //         expect(setCallback).toHaveBeenCalledTimes(1);
        //         expect(setCallback).toHaveBeenCalledWith('test', 123, cacheElement);
        //     });

    });

    // describe('Options', () => {

    //     it('should expire on expireTime', async () => {
    //         const layer = new MemoryLayer<number>({ expireTime: Time.from('1s') });
    //         const cacheElement = createCacheElement(123);
    //         layer.setData('test', cacheElement);
    //         expect(layer.getData('test')).toBe(cacheElement);
    //         expect(layer.size()).toBe(1);
    //         await sleep(2000);
    //         expect(layer.getData('test')).toBeUndefined();
    //         expect(layer.size()).toBe(0);
    //     }, 5000);

    //     it('should clearExpiredOnSizeExceeded', async () => {

    //         const layer = new MemoryLayer<number>({
    //             clearExpiredOnSizeExceeded: true,
    //             sizeExceededStrategy: 'no-cache',
    //             maxSize: 2
    //         });

    //         layer.setData('test1', createCacheElement(99, '1s'));
    //         expect(layer.size()).toBe(1);

    //         await sleep(2000);

    //         layer.setData('test2', createCacheElement(99));
    //         expect(layer.size()).toBe(2);

    //         layer.setData('test3', createCacheElement(99));
    //         expect(layer.size()).toBe(2);

    //         expect(layer.getData('test3')?.value).toBe(99);
    //         expect(layer.getData('test1')).toBeUndefined();
    //         expect(layer.size()).toBe(2);

    //     }, 4000);

    //     it('should sizeExceededStrategy no-cache', async () => {
    //         const layer = new MemoryLayer<number>({
    //             clearExpiredOnSizeExceeded: false,
    //             sizeExceededStrategy: 'no-cache',
    //             maxSize: 2
    //         });
    //         layer.setData('test1', createCacheElement(99));
    //         layer.setData('test2', createCacheElement(99));
    //         layer.setData('test3', createCacheElement(99));
    //         expect(layer.getData('test3')).toBeUndefined();
    //     });

    //     it('should sizeExceededStrategy throw-error', async () => {
    //         const layer = new MemoryLayer<number>({
    //             clearExpiredOnSizeExceeded: false,
    //             sizeExceededStrategy: 'throw-error',
    //             maxSize: 2
    //         });
    //         layer.setData('test1', createCacheElement(99));
    //         layer.setData('test2', createCacheElement(99));

    //         expect(() => {
    //             layer.setData('test3', createCacheElement(99));
    //         }).toThrow();

    //     });

    //     it('should expire on interval', async () => {

    //         const layer = new MemoryLayer<number>({
    //             expireTime: Time.from('1s'),
    //             expireOnInterval: true,
    //             expireCheckInterval: Time.from('2s')
    //         });

    //         const onExpire = jest.fn(() => { });
    //         layer.on('expire', onExpire);

    //         const cacheElement = createCacheElement(123);
    //         layer.setData('test', cacheElement);
    //         expect(layer.getData('test')).toBe(cacheElement);
    //         expect(layer.size()).toBe(1);

    //         await sleep(3000);

    //         expect(layer.getData('test')).toBeUndefined();
    //         expect(layer.size()).toBe(0);
    //         expect(onExpire).toHaveBeenCalledTimes(1);
    //         expect(onExpire).toHaveBeenCalledWith('test', cacheElement.value, cacheElement);

    //         layer.dispose();

    //     }, 5000);

    //     it('should error expireOnInterval without expireCheckInterval', async () => {

    //         function createLayer() {
    //             new MemoryLayer<number>({ expireOnInterval: true, });
    //         }

    //         expect(createLayer).toThrow();

    //     });

    // });

});

