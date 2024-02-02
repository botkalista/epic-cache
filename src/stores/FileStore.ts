import fs from 'fs';
import path from 'path';
import { CacheElement } from "../models/CacheElement";
import { Store } from "../interfaces/Store";

export type FileStoreOptions = {
    storePath: string,
    fileNames?: () => string
}

export class FileStore<DataType = any> implements Store<DataType> {

    private data = new Map<string, CacheElement<string>>();

    constructor(protected options: FileStoreOptions) {
        const defaultFileNames = () => (Date.now() + Math.floor(Math.random() * 9000000)).toString();
        this.options.fileNames = this.options.fileNames || defaultFileNames;
        fs.rmSync(this.options.storePath, { force: true });
        this.ensurePathExist(this.options.storePath);
    }

    has(key: string): boolean {
        return this.data.has(key);
    }
    get(key: string): DataType {
        const fileName = this.data.get(key)?.value;
        if (!fileName) throw Error('Key not found');
        const raw = fs.readFileSync(fileName, 'utf8');
        const json = JSON.parse(raw);
        return json;
    }
    set(key: string, value: CacheElement<DataType>) {
        const fileName = this.options.fileNames();
        const fileContent = JSON.stringify(value.value);
        const filePath = this.getFinalPath(fileName);
        fs.writeFileSync(filePath, fileContent);
        this.data.set(key, value.copyWithValue(filePath));
    }
    del(key: string) {
        const filePath = this.data.get(key);
        fs.rmSync(filePath.value);
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



    private ensurePathExist(folder: string) {
        const pathArray = path.resolve(folder).split('\\');
        pathArray.reduce((oldPath, piece) => {
            const currentPath = path.join(oldPath, piece);
            if (!fs.existsSync(currentPath)) fs.mkdirSync(currentPath);
            return currentPath;
        });
    }

    private getFinalPath(fileName: string) {
        return path.join(this.options.storePath, fileName);
    }

}