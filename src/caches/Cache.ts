import { LayerManger } from "../components/LayerManager";

export type LayerSelectionStrategy = 'random' | 'ordered' | 'custom';
export type LayerSizeExceededStrategy = 'use-next-layer' | 'custom';

export type EpicCacheOptions = {
    layerSelection?: LayerSelectionStrategy,
    layerSelectionFunction?: any
}

const defaultEpicCacheOptions: Required<EpicCacheOptions> = {
    layerSelection: "ordered",
    layerSelectionFunction: () => { }
}

export class EpicCache {
    public layers = new LayerManger();
    protected options: EpicCacheOptions;
    constructor(options?: EpicCacheOptions) {
        this.options = { ...options, ...defaultEpicCacheOptions }
    }
}