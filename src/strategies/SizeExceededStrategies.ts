import { Layer } from "../components/Layer";



export type SizeExceededStrategy<DataType> = (layer: Layer<DataType>) => any;
type SizeExceededStrategyFunction<DataType> = (...args: any) => SizeExceededStrategy<DataType>;
type SizeExceededStrategyName = 'no-cache' | 'throw-error';


export const SIZE_EXCEEDED_STRATEGY = {
    'no-cache': noCacheStrategy,
    'throw-error': throwErrorStrategy
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
