import { EpicCache } from "../components/Cache";
import { Layer } from "../components/Layer";


export type LayerSizeExceededStrategy<DataType> =
    (cache: EpicCache<DataType>, layer: Layer<DataType>) => any;

type LayerSizeExceededStrategyFunction<DataType> =
    (...args: any) => LayerSizeExceededStrategy<DataType>;

type LayerSizeExceededStrategyName = 'USE_NEXT_LAYER';


export const LAYER_SIZE_EXCEEDED_STRATEGY = {
    'USE_NEXT_LAYER': useNextLayerStrategy,
} satisfies Record<LayerSizeExceededStrategyName, LayerSizeExceededStrategyFunction<any>>

function useNextLayerStrategy<DataType>() {
    return function (cache: EpicCache<DataType>, layer: Layer<DataType>) {
        return;
        // const layers = cache.getRawLayers();
        // const index = layers.findIndex(e => e.layer == layer);
        // const nextLayer = layers[index + 1];
        // if (!nextLayer) return;
        // cache.setActiveLayer(index);
    }
}