import { LayerSizeExceededStrategy } from "../caches/Cache";
import { CacheLayer } from "../interfaces/ICacheLayer";



export class LayerManger {
    private layers: {
        target: CacheLayer<any, any>,
        strategy: LayerSizeExceededStrategy,
        customStrategy?: any
    }[] = [];

    constructor() { }

    //TODO: Overloading
    add(layer: CacheLayer<any, any>, strategy: LayerSizeExceededStrategy, customStrategy?: any) {
        this.layers.push({ target: layer, strategy, customStrategy });
    }


}