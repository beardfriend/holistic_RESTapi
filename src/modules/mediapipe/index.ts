import BrowserEnv from '../../modules/browser/browserEnv';
const benv = new BrowserEnv();
benv.init();
import '@mediapipe/face_mesh';
import '@mediapipe/hands';
import '@tensorflow/tfjs-node';
import '@tensorflow/tfjs-backend-webgl';
import { Tensor3D } from '@tensorflow/tfjs-node';

export interface Solution<T, F> {
    module: F;
    init(): void;
    get(input: PixelInput): Promise<Result<T>>;
    reset(): void;
}

export interface Result<T> {
    data: T[];
    modelName: ModelName;
}

export type ModelName = 'pose' | 'hands' | 'face';

export type PixelInput = Tensor3D | ImageData | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement | ImageBitmap;

export { default as Face } from './face';
export { default as Pose } from './pose';
export { default as Hands } from './hands';
