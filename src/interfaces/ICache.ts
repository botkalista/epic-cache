import { BetterEmitter } from "../components/BetterEmitter";
import { CacheElement } from "../models/CacheElement";

type ICacheEventsMap<
    StoreType = any,
    SetType = StoreType,
    GetType = SetType
> = {
    get: (key: string, value: GetType, element: CacheElement<GetType>) => any;
    add: (key: string, value: CacheElement<StoreType>) => any;
    expire: (key: string) => any;
    delete: (key: string) => any;
}
