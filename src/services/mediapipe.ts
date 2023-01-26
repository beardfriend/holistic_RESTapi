import { Pose, Face, Hands } from '../modules/mediapipe/index';
import IHolistic from '../transport/response';

import '@tensorflow/tfjs-core';
import * as tfnode from '@tensorflow/tfjs-node';
import '@tensorflow/tfjs-backend-webgl';
import '@mediapipe/face_mesh';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as handsPoseDetection from '@tensorflow-models/hand-pose-detection';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

class MediaPipeService {
    modules: [Pose, Face, Hands];

    constructor() {
        const pose = new Pose();
        const face = new Face();
        const hands = new Hands();
        this.modules = [pose, face, hands];
        // 모듈 초기화
        this.modules.forEach(async (module) => {
            await module.init().catch((err) => new Error(err));
        });
    }

    async getHolistic(file: Buffer): Promise<IHolistic> {
        try {
            // declare empty result
            const response: IHolistic = {
                faceLandmarks: [],
                leftHandLandmarks: [],
                poseLandmarks: [],
                rightHandLandmark: [],
            };

            // TODO : video processing

            // image or video file to tensor3D
            tfnode.setBackend('tensorflow');
            const tensor = (await tfnode.node.decodeImage(file)) as tfnode.Tensor3D;

            // get holistic
            tfnode.setBackend('cpu');
            const holisticResult = await Promise.all(this.modules.map(async (d) => await d.get(tensor)));

            // data processing
            holisticResult.forEach((d) => {
                if (d.modelName === 'pose') {
                    const data = d.data as poseDetection.Pose[];

                    data[0]?.keypoints?.forEach((d) => {
                        response.poseLandmarks.push({
                            x: d.x,
                            y: d.y,
                            z: d.z ? d.z : null,
                            visibility: d.score ? d.score : null,
                        });
                    });
                }

                if (d.modelName === 'face') {
                    const data = d.data as faceLandmarksDetection.Face[];

                    data[0]?.keypoints?.forEach((d) => {
                        response.faceLandmarks.push({
                            x: d.x,
                            y: d.y,
                            z: d.z ? d.z : null,
                            visibility: d.score ? d.score : null,
                        });
                    });
                }

                if (d.modelName === 'hands') {
                    const data = d.data as handsPoseDetection.Hand[];

                    data?.forEach((hands) => {
                        if (hands.handedness === 'Right') {
                            hands?.keypoints?.forEach((d) => {
                                response.leftHandLandmarks.push({
                                    x: d.x,
                                    y: d.y,
                                    z: d.z ? d.z : null,
                                    visibility: d.score ? d.score : null,
                                });
                            });
                        } else if (hands.handedness === 'Left') {
                            hands?.keypoints?.forEach((d) => {
                                response.rightHandLandmark.push({
                                    x: d.x,
                                    y: d.y,
                                    z: d.z ? d.z : null,
                                    visibility: d.score ? d.score : null,
                                });
                            });
                        }
                    });
                }
            });

            return response;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            throw new Error(err);
        }
    }
}

export default MediaPipeService;
