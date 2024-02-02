import { Layer } from "./Layer";
import { LayerSizeExceededStrategy } from '../strategies/LayerSizeExceededStrategies';


export type LayerBehavior<T> = {
    sizeExceededStrategy: LayerSizeExceededStrategy<T>
};

export class EpicCache<T> {

    private layers: { layer: Layer<T>, behavior: LayerBehavior<T> }[] = [];

    constructor() { }


    set(key: string, value: T) {
        for (const layerData of this.layers) {
            const ok = layerData.layer.set(key, value);
            if (ok) return true;
        }
        return false;
    }

    get(key: string) {
        for (const layerData of this.layers) {
            const data = layerData.layer.get(key);
            if (data) return data;
        }
    }

    has(key: string): [boolean, Layer<T>, number] {
        for (let i = 0; i < this.layers.length; i++) {
            const data = this.layers[i].layer.has(key);
            if (data) return [true, this.layers[i].layer, i];
        }
        return [false, undefined, -1];
    }

    del(key: string) {
        for (const layerData of this.layers) {
            layerData.layer.del(key);
        }
    }


    addLayer(layer: Layer<T>, behavior: LayerBehavior<T>) {
        this.layers.push({ layer, behavior });
    }

    removeLayer(layer: Layer<T>) {
        const index = this.layers.findIndex(e => e.layer == layer);
        if (index == -1) return;
        this.removeLayerAt(index);
    }

    removeLayerAt(index: number) {
        this.layers.splice(index, 1);
    }

    getRawLayers() {
        return this.layers;
    }

}