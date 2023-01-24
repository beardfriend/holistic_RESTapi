import BrowserEnv from '../../libs/browserEnv';
const benv = new BrowserEnv();
benv.init();
import '@mediapipe/face_mesh';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import { Tensor3D } from '@tensorflow/tfjs-core';

export interface Solution<T, F> {
    module: F;
    init(): void;
    get(input: PixelInput): Promise<T[]>;
}

export type PixelInput = Tensor3D | ImageData | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement | ImageBitmap;

export { default as Face } from './face';
export { default as Pose } from './pose';
