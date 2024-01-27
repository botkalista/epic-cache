# Simple nodejs caching module

# Install

```bash
npm i epic-cache
```

# Cache classes

## Cache

The base **abstract** class extended by the other cache classes.
> **Only used to create other types of cache.**

## GenericCache

The main cache, it holds a map of `<String, CacheType = any>`

### Create the instance

```ts
import { GenericCache } from 'epic-cache';
const cache = new GenericCache<CacheType>(options);
```

- `CacheType`: *(default: `any`)*
Type of the elements you want to store in cache.
- `options?`: **GenericCacheOptions**

#### GenericCacheOptions

- `maxSize`: *(default: `1000`)*
max elements to store in cache
- `sizeExceededStrategy`: *(default: `no-cache`)*
action to perform when an element is add to the cache when it's full.
	- `no-cache`: don't put the new element in the cache
	- `throw-error`: throw an error

- `clearExpiredOnSizeExceeded`: *(default: `true`)*
clear all the expired keys before trying to an element to the cache when it's full

- `defaultExpireTime`: *(default: `15m`)*
default expire time assigned to elements add to cache without their own expireTime

	- The type of `defaultExpireTime` is `Time` | `TimeString` | `number`
	<br>
	> [*Read more about the time classes*](#time-classes)
    
- `expireOnInterval`: *(default: `true`)*
check and remove the expired keys every interval (the cache will always remove the expired keys when you try to get them regardless of this value)

- `expireCheckInterval`: *(default: `10m`)*
the time interval to check and remote expired keys

	- The type of `expireCheckInterval` is `Time` | `TimeString` | `number`
	<br>
	> [*Read more about the time classes*](#time-classes)

### Methods

#### Add an element

```ts
import { GenericCache, CacheElement } from 'epic-cache';
const cache = new GenericCache<number>();

// Add MattAge to the cache with value 31 with default expireTime of the cache
cache.set('MattAge', CacheElement.from(31));

// Add TaylorAge to the cache with value 22 with 10 seconds before expiration
cache.set('TaylorAge', CacheElement.from(22, '10s'));

// Note: you can also use the add function - The behavior is the exact same
cache.add('TaylorAge', CacheElement.from(22, '10s'))
```
> [*Read more about the **CacheElement** class*](#time-classes)

#### Get an element

```ts
import { GenericCache, CacheElement } from 'epic-cache';
const cache = new GenericCache<number>();

cache.set('TaylorAge', CacheElement.from(22));

// Get the element from the cache
const taylorAge = cache.get('TaylorAge'); // 22
```

#### Delete an element

```ts
// TODO: Create the code
```

### Events

```ts
// TODO: Create the code and the docs
```


## CacheElement

```ts
// TODO: Create the code and the docs
```

## Time classes

When you need to provide a time value you can use one of this three methods:

- `TimeString` type

```ts
import type { TimeString } from 'epic-cache';

const oneSecond: TimeString = '1s';
const fiveSeconds: TimeString = '5s';
const oneMinute: TimeString = '1m';
const oneHour: TimeString = '1h';
```

- `number` as milliseconds

```ts
const oneSecond = 1000;
const fiveSeconds = 1000 * 5;
const oneMinute = 1000 * 60;
const oneHour = 1000 * 60 * 60;
```

- `Time` class

```ts
import { Time } from 'epic-cache';

// You can pass a number or a TimeString as value
const oneSecond = new Time(1000);
const fiveSecond = new Time('5s');

// You can also use the static method from to create an instance
const oneMinute = Time.from(1000 * 60);
const oneHour = Time.from('1h');
```