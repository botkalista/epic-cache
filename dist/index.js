var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  CacheElement: () => CacheElement2,
  Time: () => Time2
});
module.exports = __toCommonJS(src_exports);

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

// src/index.ts
var CacheElement2 = CacheElement;
var Time2 = Time;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CacheElement,
  Time
});
//# sourceMappingURL=index.js.map