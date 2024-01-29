// src/models/Time.ts
var TIMEUNITS = {
  "s": 1e3,
  "m": 1e3 * 60,
  "h": 1e3 * 60 * 60,
  "d": 1e3 * 60 * 60 * 24
};
var Time = class _Time {
  value;
  constructor(data) {
    this.value = this.convertToMilliseconds(data);
  }
  convertToMilliseconds(data) {
    if (typeof data === "number")
      return data;
    const numeric = parseInt(data);
    const unit = data.replace(numeric.toString(), "");
    const unitValue = TIMEUNITS[unit];
    if (!unitValue)
      throw Error(`Invalid unit value. Received ${unit}, expected ${Object.keys(TIMEUNITS).join("or")}`);
    return numeric * unitValue;
  }
  static from(data) {
    const instance = new _Time(data);
    return instance;
  }
};

// src/models/CacheElement.ts
var CacheElement = class _CacheElement {
  static DEFAULT_TIMESTAMP = -1;
  value;
  expireTimestamp = _CacheElement.DEFAULT_TIMESTAMP;
  constructor(value, expireIn) {
    this.value = value;
    if (!expireIn)
      return;
    if (expireIn instanceof Time) {
      this.expireTimestamp = Date.now() + expireIn.value;
    } else {
      const time = Time.from(expireIn);
      this.expireTimestamp = Date.now() + time.value;
    }
  }
  withValue(newValue) {
    const instance = new _CacheElement(newValue);
    instance.expireTimestamp = this.expireTimestamp;
    return instance;
  }
  copy() {
    const instance = new _CacheElement(this.value);
    instance.expireTimestamp = this.expireTimestamp;
    return instance;
  }
  static from(value, expireIn) {
    const instance = new _CacheElement(value, expireIn);
    return instance;
  }
  isExpired() {
    if (this.expireTimestamp <= 0)
      return false;
    return this.expireTimestamp < Date.now();
  }
};

// src/components/BetterEmitter.ts
var BetterEmitter = class {
  handlers = [];
  emit(event, ...data) {
    this.handlers.filter((handler) => handler.type == event).forEach((handler) => {
      handler.callback(...data);
    });
    return this;
  }
  on(event, callback) {
    this.handlers.push({ type: event, callback });
    return this;
  }
};

// src/caches/Cache.ts
var Cache = class extends BetterEmitter {
  options;
  cache = /* @__PURE__ */ new Map();
  setTransform;
  getTransform;
  constructor(defaultOptions) {
    super();
    this.options = defaultOptions;
  }
  _rawCache() {
    return this.cache;
  }
  size() {
    return this.cache.size;
  }
  option(optionName) {
    return this.options[optionName];
  }
  getElement(key) {
    if (!this.getTransform)
      throw Error("processBeforeGet not called");
    const element = this.cache.get(key);
    this.emit("get", key);
    const result = this.getTransform(key, element);
    return result;
  }
  setElement(key, element) {
    if (!this.setTransform)
      throw Error("processBeforeSet not called");
    const processedElement = this.setTransform(key, element);
    this.cache.set(key, processedElement);
    this.emit("add", key, processedElement);
    return this;
  }
  removeElement(key, expired) {
    this.emit(expired ? "expire" : "delete", key);
    this.cache.delete(key);
    return this;
  }
  clearExpired() {
    const toDelete = [];
    for (const key of this.cache.keys()) {
      if (this.cache.get(key).isExpired())
        toDelete.push(key);
    }
    toDelete.forEach((e) => this.removeElement(e, true));
  }
  processBeforeSet(callback) {
    this.setTransform = callback;
    return this;
  }
  processBeforeGet(callback) {
    this.getTransform = callback;
    return this;
  }
  set(key, element) {
    return this.add(key, element);
  }
  add(key, element) {
    if (element.expireTimestamp == CacheElement.DEFAULT_TIMESTAMP)
      element.expireTimestamp = Date.now() + this.options.defaultExpireTime.value;
    if (this.cache.size < this.options.maxSize)
      return this.setElement(key, element);
    const hasElement = this.cache.has(key);
    if (hasElement)
      return this.setElement(key, element);
    if (this.options.clearExpiredOnSizeExceeded)
      this.clearExpired();
    if (this.cache.size < this.options.maxSize)
      return this.setElement(key, element);
    if (this.options.sizeExceededStrategy === "no-cache")
      return this;
    if (this.options.sizeExceededStrategy === "throw-error")
      throw Error("Cache size exceeded");
  }
  get(key) {
    const element = this.cache.get(key);
    if (!element)
      return;
    if (!element.isExpired())
      return this.getElement(key).value;
    this.emit("expire", key);
    this.removeElement(key, false);
    return;
  }
  del(key) {
    this.removeElement(key, false);
    return this;
  }
};

// src/caches/GenericCache.ts
var defaultGenericCacheOptions = {
  maxSize: 1e3,
  sizeExceededStrategy: "no-cache",
  clearExpiredOnSizeExceeded: true,
  defaultExpireTime: Time.from("15m"),
  expireOnInterval: true,
  expireCheckInterval: Time.from("10m")
};
var GenericCache = class extends Cache {
  constructor(options) {
    super({ ...defaultGenericCacheOptions, ...options });
    super.processBeforeGet((key, element) => element).processBeforeSet((key, element) => element);
  }
};
export {
  CacheElement,
  GenericCache,
  Time,
  defaultGenericCacheOptions
};
//# sourceMappingURL=index.mjs.map