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
                sizeExceededStrategy: SIZE_EXCEEDED_STRATEGY.NO_CACHE(),
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
                sizeExceededStrategy: SIZE_EXCEEDED_STRATEGY.NO_CACHE(),
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
                sizeExceededStrategy: SIZE_EXCEEDED_STRATEGY.NO_CACHE(),
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
                sizeExceededStrategy: SIZE_EXCEEDED_STRATEGY.NO_CACHE(),
            });

            layer.set('a', 123);
            expect(layer.size()).toBe(1);
            layer.del('a');
            expect(layer.get('a')).toBeUndefined();
            expect(layer.size()).toBe(0);
        });

    });

    describe('Events', () => {

        it('should fire onGet', () => {

            const store = new MemoryStore<number>();

            const layer = new Layer(store, {
                maxSize: 100,
                expireTime: Time.from('1m'),
                expireOnInterval: false,
                clearExpiredOnSizeExceeded: false,
                sizeExceededStrategy: SIZE_EXCEEDED_STRATEGY.NO_CACHE(),
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
                sizeExceededStrategy: SIZE_EXCEEDED_STRATEGY.NO_CACHE(),
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
                sizeExceededStrategy: SIZE_EXCEEDED_STRATEGY.NO_CACHE(),
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
                sizeExceededStrategy: SIZE_EXCEEDED_STRATEGY.NO_CACHE(),
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

        it('should fire onSet', async () => {

            const store = new MemoryStore<number>();

            const layer = new Layer(store, {
                maxSize: 100,
                expireTime: Time.from('1m'),
                expireOnInterval: false,
                clearExpiredOnSizeExceeded: false,
                sizeExceededStrategy: SIZE_EXCEEDED_STRATEGY.NO_CACHE(),
            });
            const setCallback = jest.fn();

            layer.on('set', setCallback);
            layer.set('test', 123);

            expect(setCallback).toHaveBeenCalledTimes(1);
            expect(setCallback).toHaveBeenCalledWith('test', 123);
        });

    });

    describe('Options', () => {

        it('should expire on expireTime', async () => {

            const store = new MemoryStore<number>();

            const layer = new Layer(store, {
                maxSize: 100,
                expireTime: Time.from('1s'),
                expireOnInterval: false,
                clearExpiredOnSizeExceeded: false,
                sizeExceededStrategy: SIZE_EXCEEDED_STRATEGY.NO_CACHE(),
            });

            layer.set('test', 123);
            expect(layer.get('test')).toBe(123);
            expect(layer.size()).toBe(1);
            await sleep(2000);
            expect(layer.get('test')).toBeUndefined();
            expect(layer.size()).toBe(0);
        }, 5000);

        it('should clearExpiredOnSizeExceeded', async () => {

            const store = new MemoryStore<number>();

            const layer = new Layer(store, {
                maxSize: 2,
                expireTime: Time.from('1m'),
                expireOnInterval: false,
                clearExpiredOnSizeExceeded: true,
                sizeExceededStrategy: SIZE_EXCEEDED_STRATEGY.NO_CACHE(),
            });

            layer.set('test1', 99, '1s');
            expect(layer.size()).toBe(1);

            await sleep(2000);

            layer.set('test2', 99);
            expect(layer.size()).toBe(2);

            layer.set('test3', 99);
            expect(layer.size()).toBe(2);

            expect(layer.get('test3')).toBe(99);
            expect(layer.get('test1')).toBeUndefined();
            expect(layer.size()).toBe(2);

        }, 4000);

        it('should sizeExceededStrategy no-cache', async () => {

            const store = new MemoryStore<number>();

            const layer = new Layer(store, {
                maxSize: 2,
                expireTime: Time.from('1m'),
                expireOnInterval: false,
                clearExpiredOnSizeExceeded: false,
                sizeExceededStrategy: SIZE_EXCEEDED_STRATEGY.NO_CACHE(),
            });

            layer.set('test1', 99);
            layer.set('test2', 99);
            layer.set('test3', 99);
            expect(layer.get('test3')).toBeUndefined();
        });

        it('should sizeExceededStrategy throw-error', async () => {

            const store = new MemoryStore<number>();

            const layer = new Layer(store, {
                maxSize: 2,
                expireTime: Time.from('1m'),
                expireOnInterval: false,
                clearExpiredOnSizeExceeded: false,
                sizeExceededStrategy: SIZE_EXCEEDED_STRATEGY.THROW_ERROR('Custom error message'),
            });

            layer.set('test1', 99);
            layer.set('test2', 99);

            expect(() => {
                layer.set('test3', 99);
            }).toThrow('Custom error message');

        });

        it('should sizeExceededStrategy custom', async () => {

            const store = new MemoryStore<number>();

            const sizeExceededFunction = jest.fn();

            const layer = new Layer(store, {
                maxSize: 2,
                expireTime: Time.from('1m'),
                expireOnInterval: false,
                clearExpiredOnSizeExceeded: false,
                sizeExceededStrategy: sizeExceededFunction
            });

            layer.set('a', 123);
            layer.set('b', 321);
            layer.set('c', 999);

            expect(sizeExceededFunction).toHaveBeenCalledTimes(1);
            expect(sizeExceededFunction).toHaveBeenCalledWith(layer);

        });

        it('should expire on interval', async () => {

            const store = new MemoryStore<number>();

            const layer = new Layer(store, {
                maxSize: 2,
                expireTime: Time.from('1s'),
                expireOnInterval: true,
                expireCheckInterval: Time.from('2s'),
                clearExpiredOnSizeExceeded: false,
                sizeExceededStrategy: SIZE_EXCEEDED_STRATEGY.NO_CACHE(),
            });

            const onExpire = jest.fn(() => { });
            layer.on('expire', onExpire);

            layer.set('test', 123);
            expect(layer.get('test')).toBe(123);
            expect(layer.size()).toBe(1);

            await sleep(3000);

            expect(layer.get('test')).toBeUndefined();
            expect(layer.size()).toBe(0);
            expect(onExpire).toHaveBeenCalledTimes(1);
            expect(onExpire).toHaveBeenCalledWith('test');

            layer.dispose();

        }, 5000);

        it('should error expireOnInterval without expireCheckInterval', async () => {

            function createLayer() {
                const store = new MemoryStore();
                const layer = new Layer(store, {
                    maxSize: 2,
                    expireTime: Time.from('1m'),
                    expireOnInterval: true,
                    clearExpiredOnSizeExceeded: false,
                    sizeExceededStrategy: SIZE_EXCEEDED_STRATEGY.NO_CACHE(),
                });
            }

            expect(createLayer).toThrow();


        });

    });

});

