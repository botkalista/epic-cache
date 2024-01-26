import * as cacheElement from "./models/CacheElement";
import * as time from "./models/Time";
import * as genericCache from "./options/GenericCacheOptions";


export const CacheElement = cacheElement.CacheElement;
export const Time = time.Time;
export type TimeString = time.TimeString;
export type GenricCache = genericCache.GenericCacheOptions;
export type SizeExceededStrategy = genericCache.SizeExceededStrategy;