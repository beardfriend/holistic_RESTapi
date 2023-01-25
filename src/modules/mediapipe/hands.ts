import * as handsPoseDetection from '@tensorflow-models/hand-pose-detection';
import { PixelInput, Result, Solution } from './index';

class Hands implements Solution<handsPoseDetection.Hand, handsPoseDetection.HandDetector> {
    module: handsPoseDetection.HandDetector;

    async init(): Promise<void | Error> {
        const detectorConfig = {
            runtime: 'tfjs',
        } as handsPoseDetection.MediaPipeHandsTfjsModelConfig;

        this.module = await handsPoseDetection
            .createDetector(handsPoseDetection.SupportedModels.MediaPipeHands, detectorConfig)
            .catch((err) => {
                console.log(err);
                return err;
            });
    }
    async get(input: PixelInput): Promise<Result<handsPoseDetection.Hand>> {
        const result: Result<handsPoseDetection.Hand> = {
            data: [],
            modelName: 'hands',
        };
        result.data = await this.module.estimateHands(input, { flipHorizontal: false });

        this.module.reset();

        return result;
    }
}

export default Hands;
