import { Store } from "../interfaces/Store";

export class MemoryStore<StoreType> implements Store<StoreType> {

    private data = new Map<string, StoreType>();

    has(key: string): boolean {
        return this.data.has(key);
    }
    get(key: string): StoreType {
        return this.data.get(key);
    }
    set(key: string, value: StoreType) {
        this.data.set(key, value);
    }
    del(key: string) {
        this.data.delete(key);
    }

}