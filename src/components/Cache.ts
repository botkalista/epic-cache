import { Layer } from "./Layer";

export type LayerSizeExceededStrategy = 'use-next-layer' | 'custom';

export type LayerBehavior<T> = {
    sizeExceededStrategy: LayerSizeExceededStrategy
};

export class EpicCache {

    private layers: { layer: Layer<any>, behavior: LayerBehavior<any> }[] = [];

    constructor() { }

    addLayer<T>(layer: Layer<T>, behavior: LayerBehavior<T>) {
        this.layers.push({ layer, behavior });
    }

    removeLayer<T>(layer: Layer<T>) {
        const index = this.layers.findIndex(e => e.layer == layer);
        if (index == -1) return;
        this.removeLayerAt(index);
    }

    removeLayerAt<T>(index: number) {
        this.layers.splice(index, 1);
    }

    getRawLayers() {
        return this.layers;
    }

}