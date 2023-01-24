import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import { PixelInput, Solution } from './index';

class Face implements Solution<faceLandmarksDetection.Face, faceLandmarksDetection.FaceLandmarksDetector> {
    module: faceLandmarksDetection.FaceLandmarksDetector;

    async init(): Promise<void | Error> {
        const detectorConfig = {
            runtime: 'tfjs',
        } as faceLandmarksDetection.MediaPipeFaceMeshTfjsModelConfig;

        this.module = await faceLandmarksDetection
            .createDetector(faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh, detectorConfig)
            .catch((err) => {
                return err;
            });
    }
    async get(input: PixelInput): Promise<faceLandmarksDetection.Face[]> {
        return await this.module.estimateFaces(input, { flipHorizontal: false });
    }
}

export default Face;
