
import { CacheElement } from "../models/CacheElement";

export interface ICacheLayer<SetType, GetType> {
    getData(key: string): CacheElement<GetType>;
    setData(key: string, value: CacheElement<SetType>): this;
    removeData(key: string): this;
}
