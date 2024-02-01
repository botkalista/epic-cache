
import { CacheElement } from "../models/CacheElement";


export interface ICacheLayerBase<SetType, GetType> {
    getData(key: string): CacheElement<GetType>;
    setData(key: string, value: CacheElement<SetType>): this;
    hasData(key: string): boolean;
    removeData(key: string): this;
    dispose(): void;
}
export interface ICacheLayerVolatile<SetType, GetType> extends ICacheLayerBase<SetType, GetType> {
    type: 'volatile';
}
export interface ICacheLayerPersistent<SetType, GetType> extends ICacheLayerBase<SetType, GetType> {
    type: 'persistent';
    load(): void;
}


export type CacheLayer<SetType, GetType> = ICacheLayerVolatile<SetType, GetType> | ICacheLayerPersistent<SetType, GetType>

// export interface ICacheLayer<SetType, GetType> {
//     getData(key: string): CacheElement<GetType>;
//     setData(key: string, value: CacheElement<SetType>): this;
//     removeData(key: string): this;
// }
