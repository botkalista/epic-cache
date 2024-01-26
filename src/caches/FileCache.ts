import path from 'path';
import fs from 'fs';

import { GenericCacheOptions, defaultGenericCacheOptions } from '../caches/GenericCache';
import { Cache } from './Cache';
import { CacheElement } from '../models/CacheElement';

export type FileCacheOptions = GenericCacheOptions & {
    filesPath: string,
    createPathAtStartup: boolean
}

export const defaultFileCacheOptions: Required<FileCacheOptions> = {
    ...defaultGenericCacheOptions,
    filesPath: './cache',
    createPathAtStartup: true
}


export class FileCache extends Cache<string, FileCacheOptions, Buffer, Buffer> {

    constructor(options?: FileCacheOptions) {
        super({ ...defaultFileCacheOptions, ...options });

        if (this.option('createPathAtStartup')) this.ensurePathExist(this.option('filesPath'));

        super
            .processBeforeGet((key, element) => {
                if (fs.existsSync(element.value)) return element.withValue(fs.readFileSync(element.value));
                throw Error(`File not found for key: ${key} value: ${element.value}`);
            })
            .processBeforeSet((key, element) => {
                const fileName = Date.now() + Math.floor(Math.random() * 1000) + '.ec';
                fs.writeFileSync(fileName, element.value)
                return element.withValue(fileName);
            })


        super.on('expire', key => {
            const fileName = this.cache.get(key);
            this.deleteFile(fileName.value);
        });
        super.on('expire', key => {
            const fileName = this.cache.get(key);
            this.deleteFile(fileName.value);
        });

    }

    private deleteFile(fileName: string) {
        const fullFileName = path.join(this.option('filesPath'), fileName);
        fs.rmSync(fullFileName, { force: true })
    }

    private ensurePathExist(folder: string) {
        const pathArray = path.resolve(folder).split('\\');
        pathArray.reduce((oldPath, piece) => {
            const currentPath = path.join(oldPath, piece);
            if (!fs.existsSync(currentPath)) fs.mkdirSync(currentPath);
            return currentPath;
        });
    }

}