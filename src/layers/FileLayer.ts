
import { Time } from "../models/Time";
import { CacheElement, copyCacheElementWithValue, createCacheElement } from "../models/CacheElement";
import { ICacheLayerPersistent } from "../interfaces/ICacheLayer";
import { Layer, RequiredLayerOptions } from "../components/Layer";

import fs from 'fs';
import path from 'path';

export type FileLayerOptions = RequiredLayerOptions & {
    cachePath: string,
    silentEvents: boolean
};

export const defaultFileLayerOptions: FileLayerOptions = {
    expireTime: Time.from('1h'),
    clearExpiredOnSizeExceeded: true,
    maxSize: 100,
    sizeExceededStrategy: 'no-cache',
    expireOnInterval: true,
    expireCheckInterval: Time.from('30m'),
    cachePath: './cache',
    silentEvents: true
}

export class FileLayer<StoreType>
    extends Layer<StoreType, StoreType, FileLayerOptions>
    implements ICacheLayerPersistent<StoreType, StoreType> {

    public type: "persistent";

    constructor(options?: Partial<FileLayerOptions>) {
        super({ ...defaultFileLayerOptions, ...options });
        this.ensurePathExist(options.cachePath);
    }

    private ensurePathExist(folder: string) {
        const pathArray = path.resolve(folder).split('\\');
        pathArray.reduce((oldPath, piece) => {
            const currentPath = path.join(oldPath, piece);
            if (!fs.existsSync(currentPath)) fs.mkdirSync(currentPath);
            return currentPath;
        });
    }

    private getFinalPath(fileName: string) {
        return path.join(this.option('cachePath'), fileName);
    }

    private data = new Map<string, CacheElement<string>>();

    public size(): number {
        return this.data.size;
    }

    protected getExpired(): [string, CacheElement<StoreType>][] {
        const expireds = Array.from(this.data.entries()).filter(e => this.isElementExpired(e[1]));
        if (this.option('silentEvents')) {
            return expireds.map(e => [e[0], undefined]);
        }
        return expireds.map(e => {
            const filePath = this.getFinalPath(e[0]);
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            return [e[0], data];
        })
    }

    protected onExpired(key: string, element: CacheElement<StoreType>): this {
        this.data.delete(key);
        const filePath = this.getFinalPath(key);
        fs.rmSync(filePath)
        return this;
    }

    protected onGet(key: string): CacheElement<StoreType> {
        const filePath = this.getFinalPath(key);
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        return content;
    }

    protected onSet(key: string, element: CacheElement<StoreType>): this {
        const filePath = this.getFinalPath(key);
        fs.writeFileSync(filePath, JSON.stringify(element));
        const elem = copyCacheElementWithValue(element, filePath)
        this.data.set(key, elem);
        return this;
    }

    protected onRemove(key: string): CacheElement<StoreType> {
        this.data.delete(key);
        const filePath = this.getFinalPath(key);

        if (this.option('silentEvents')) {
            fs.rmSync(filePath);
            return;
        }

        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        fs.rmSync(filePath)
        return content;
    }

    protected onHas(key: string): boolean {
        return this.data.has(key);
    }

    public load() {
        const files = fs.readdirSync(this.option('cachePath'))
        for (const file of files) {
            const filePath = this.getFinalPath(file);
            const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            //TODO: reset timestamp on load? saving with delta?
            this.data.set(file, content);
        }
    }
}
