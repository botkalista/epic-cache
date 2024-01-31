import { CacheElement } from "../models/CacheElement";
import { ICacheLayer } from "../interfaces/ICache";


export class AbstractCache<
    StoreType = any,
    SetType = StoreType,
    GetType = SetType
> implements ICacheLayer<StoreType, SetType, GetType> {

    private get(key: string): GetType {
        throw new Error("Method not implemented.");
    }
    add(key: string, element: SetType | CacheElement<SetType>): this {
        throw new Error("Method not implemented.");
    }
    set(key: string, element: SetType | CacheElement<SetType>): this {
        throw new Error("Method not implemented.");
    }
    actionGet(): CacheElement<GetType> {
        throw new Error("Method not implemented.");
    }

}

