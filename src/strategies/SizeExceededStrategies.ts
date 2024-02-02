import { Layer } from "../components/Layer";



export type SizeExceededStrategy<DataType> = (layer: Layer<DataType>) => any;
type SizeExceededStrategyFunction<DataType> = (...args: any) => SizeExceededStrategy<DataType>;
type SizeExceededStrategyName = 'NO_CACHE' | 'THROW_ERROR';


export const SIZE_EXCEEDED_STRATEGY = {
    'NO_CACHE': noCacheStrategy,
    'THROW_ERROR': throwErrorStrategy
} satisfies Record<SizeExceededStrategyName, SizeExceededStrategyFunction<any>>

function noCacheStrategy<DataType>() {
    return function (layer: Layer<DataType>) {
        return;
    }
}

function throwErrorStrategy<DataType>(error?: string) {
    return function (layer: Layer<DataType>) {
        throw Error(error || 'Size exceeded');
    }
}
