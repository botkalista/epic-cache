import { CacheElement } from "../models/CacheElement";
import { Store } from "../interfaces/Store";

export class MemoryStore<DataType = any> implements Store<DataType> {

    private data = new Map<string, CacheElement<DataType>>();

    has(key: string): boolean {
        return this.data.has(key);
    }
    get(key: string): DataType {
        return this.data.get(key)?.value;
    }
    set(key: string, value: CacheElement<DataType>) {
        this.data.set(key, value);
    }
    del(key: string) {
        this.data.delete(key);
    }
    size(): number {
        return this.data.size;
    }
    isExpired(key: string): boolean {
        return this.data.get(key).isExpired();
    }
    listExpired(): string[] {
        const expired: string[] = [];
        for (const [key, value] of this.data.entries()) {
            if (value.isExpired()) expired.push(key);
        }
        return expired;
    }

}