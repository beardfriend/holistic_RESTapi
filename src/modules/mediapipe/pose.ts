import * as poseDetection from '@tensorflow-models/pose-detection';
import { PixelInput, Solution } from './index';

class Pose implements Solution<poseDetection.Pose, poseDetection.PoseDetector> {
    module: poseDetection.PoseDetector;

    async init(): Promise<void | Error> {
        this.module = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet).catch((err) => {
            return err;
        });
    }
    async get(input: PixelInput): Promise<poseDetection.Pose[]> {
        return await this.module.estimatePoses(input, { flipHorizontal: false });
    }
}

export default Pose;
