import { CacheElement } from "./models/CacheElement";


console.log(new CacheElement('test'));
console.log(new CacheElement('test', 123));
console.log(new CacheElement('test', new Date(2024, 1, 25, 20, 30)));
console.log(new CacheElement('test', '2h'));

