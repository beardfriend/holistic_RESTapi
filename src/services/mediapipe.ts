import { Pose, Face, Hands, Result } from '../modules/mediapipe/index';
import IHolistic from '../transport/response';

import * as tfnode from '@tensorflow/tfjs-node';

import '@mediapipe/face_mesh';
import '@tensorflow/tfjs-backend-wasm';
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

    async getHolistics(bufferMap: Map<number, Buffer>): Promise<IHolistic[]> {
        try {
            const tensorMap = await this.bufferToTensor3D(bufferMap);

            // get holistic
            const holistics = await this.getHolisticData(tensorMap);

            return this.dataProcessing(holistics);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            throw new Error(err);
        }
    }

    private async bufferToTensor3D(bufferMap: Map<number, Buffer>): Promise<Map<number, tfnode.Tensor3D>> {
        const result = new Map<number, tfnode.Tensor3D>();

        await tfnode.setBackend('tensorflow');

        await Promise.all(
            Array.from(bufferMap).map(async ([key, buf]) => {
                const tensor = (await tfnode.node.decodeImage(buf)) as tfnode.Tensor3D;
                await result.set(key, tensor);
            })
        );

        return result;
    }

    private async getHolisticData(tensorMap: Map<number, tfnode.Tensor3D>) {
        try {
            const result = new Map<
                number,
                (Result<poseDetection.Pose> | Result<faceLandmarksDetection.Face> | Result<handsPoseDetection.Hand>)[]
            >();

            await tfnode.setBackend('wasm');

            for (const [key, tensor] of tensorMap) {
                let dataArr = [];
                for (const md of this.modules) {
                    const data = await md.get(tensor);
                    dataArr.push(data);
                }
                await result.set(key, dataArr);
                console.log(key);
                dataArr = [];
            }

            this.modules.forEach((d) => {
                d.reset();
            });

            return result;
        } catch (err: any) {
            return err;
        }
    }

    private dataProcessing(
        dataMap: Map<
            number,
            (Result<poseDetection.Pose> | Result<faceLandmarksDetection.Face> | Result<handsPoseDetection.Hand>)[]
        >
    ): IHolistic[] {
        const response: IHolistic[] = [];

        let i = 0;
        dataMap?.forEach((result, key) => {
            response.push({
                index: key,
                faceLandmarks: [],
                leftHandLandmarks: [],
                poseLandmarks: [],
                rightHandLandmark: [],
            });

            result?.forEach((d) => {
                if (d.modelName === 'pose') {
                    const data = d.data as poseDetection.Pose[];

                    data[0]?.keypoints?.forEach((d) => {
                        response[i].poseLandmarks.push({
                            x: d.x,
                            y: d.y,
                            z: d.z ? d.z : undefined,
                            visibility: d.score ? d.score : undefined,
                        });
                    });
                }

                if (d.modelName === 'face') {
                    const data = d.data as faceLandmarksDetection.Face[];

                    data[0]?.keypoints?.forEach((d) => {
                        response[i].faceLandmarks.push({
                            x: d.x,
                            y: d.y,
                            z: d.z ? d.z : undefined,
                            visibility: d.score ? d.score : undefined,
                        });
                    });
                }

                if (d.modelName === 'hands') {
                    const data = d.data as handsPoseDetection.Hand[];

                    data?.forEach((hands) => {
                        if (hands.handedness === 'Right') {
                            hands?.keypoints?.forEach((d) => {
                                response[i].leftHandLandmarks.push({
                                    x: d.x,
                                    y: d.y,
                                    z: d.z ? d.z : undefined,
                                    visibility: d.score ? d.score : undefined,
                                });
                            });
                        } else if (hands.handedness === 'Left') {
                            hands?.keypoints?.forEach((d) => {
                                response[i].rightHandLandmark.push({
                                    x: d.x,
                                    y: d.y,
                                    z: d.z ? d.z : undefined,
                                    visibility: d.score ? d.score : undefined,
                                });
                            });
                        }
                    });
                }
            });
            i++;
        });

        return response?.sort((a: IHolistic, b: IHolistic): any => {
            if (a.index > b.index) return 1;
            if (a.index === b.index) return 0;
            if (a.index < b.index) return -1;
        });
    }
}

export default MediaPipeService;
