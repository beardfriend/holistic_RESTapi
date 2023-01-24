import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import { Tensor3D } from '@tensorflow/tfjs-core';

export interface Solution<T, F> {
    module: F;
    init(): void;
    get(input: PixelInput): Promise<T[]>;
}

export type PixelInput = Tensor3D | ImageData | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement | ImageBitmap;
